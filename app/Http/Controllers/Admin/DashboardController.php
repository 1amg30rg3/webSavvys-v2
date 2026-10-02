<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const SORTS = ['hits', 'last_seen', 'first_seen', 'ip'];

    public function __invoke(Request $request): Response
    {
        $from = $this->parseDate($request->query('from'));
        $to = $this->parseDate($request->query('to'));
        $custom = $from !== null && $to !== null;

        if ($custom) {
            if ($from->gt($to)) {
                [$from, $to] = [$to, $from];
            }
            $to = $to->min(now())->endOfDay();
            $from = $from->max($to->copy()->subDays(365)->startOfDay());
            $days = (int) $from->diffInDays($to->copy()->startOfDay()) + 1;
        } else {
            $days = in_array((int) $request->query('range'), [1, 7, 30, 90], true) ? (int) $request->query('range') : 30;
        }
        $filters = [
            'range' => $days,
            'from' => $custom ? $from->toDateString() : '',
            'to' => $custom ? $to->toDateString() : '',
            'bots' => $request->boolean('bots'),
            'q' => trim((string) $request->query('q', '')),
            'ip' => trim((string) $request->query('ip', '')),
            'device' => (string) $request->query('device', ''),
            'browser' => (string) $request->query('browser', ''),
            'os' => (string) $request->query('os', ''),
            'locale' => (string) $request->query('locale', ''),
            'path' => (string) $request->query('path', ''),
            'referrer' => (string) $request->query('referrer', ''),
        ];
        $sort = in_array($request->query('sort'), self::SORTS, true) ? $request->query('sort') : 'last_seen';
        $dir = $request->query('dir') === 'asc' ? 'asc' : 'desc';

        $since = $custom ? $from->copy() : now()->startOfDay()->subDays($days - 1);
        $until = $custom ? $to->copy() : now()->endOfDay();
        $prevSince = (clone $since)->subDays($days);

        // Every query goes through here: excluded IPs are always hidden.
        $all = fn (): Builder => Visit::query()->whereNotIn('ip', config('admin.excluded_ips'));

        $scoped = fn (Builder $q, bool $withBots = true): Builder => $q
            ->when(! $filters['bots'] && $withBots, fn (Builder $q) => $q->where('is_bot', false))
            ->when($filters['q'] !== '', fn (Builder $q) => $q->where(fn (Builder $w) => $w
                ->where('ip', 'like', $filters['q'].'%')
                ->orWhere('path', 'like', '%'.$filters['q'].'%')))
            ->when($filters['ip'] !== '', fn (Builder $q) => $q->where('ip', 'like', $filters['ip'].'%'))
            ->when($filters['device'] !== '', fn (Builder $q) => $q->where('device', $filters['device']))
            ->when($filters['browser'] !== '', fn (Builder $q) => $q->where('browser', $filters['browser']))
            ->when($filters['os'] !== '', fn (Builder $q) => $q->where('os', $filters['os']))
            ->when($filters['locale'] !== '', fn (Builder $q) => $q->where('locale', $filters['locale']))
            ->when($filters['path'] !== '', fn (Builder $q) => $q->where('path', $filters['path']))
            ->when($filters['referrer'] !== '', fn (Builder $q) => $filters['referrer'] === 'Direct'
                ? $q->whereNull('referrer')
                : $q->where('referrer', 'like', '%://'.$filters['referrer'].'%'));

        $base = fn (): Builder => $scoped($all()->whereBetween('visited_at', [$since, $until]));
        $previous = fn (): Builder => $scoped($all()->where('visited_at', '>=', $prevSince)->where('visited_at', '<', $since));

        $perDay = $base()
            ->selectRaw('date(visited_at) as day, count(*) as views, count(distinct ip) as visitors')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $series = [];
        for ($i = 0; $i < $days; $i++) {
            $day = Carbon::parse($since)->addDays($i)->toDateString();
            $series[] = [
                'date' => $day,
                'views' => (int) ($perDay[$day]->views ?? 0),
                'visitors' => (int) ($perDay[$day]->visitors ?? 0),
            ];
        }

        $breakdown = fn (string $column, int $limit = 8) => $base()
            ->selectRaw("coalesce($column, 'Unknown') as label, count(*) as value")
            ->groupBy('label')
            ->orderByDesc('value')
            ->limit($limit)
            ->get();

        $hourExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "cast(strftime('%H', visited_at) as integer)"
            : 'hour(visited_at)';
        $hours = $base()->selectRaw("$hourExpr as hour, count(*) as value")->groupBy('hour')->pluck('value', 'hour');

        $referrers = $base()
            ->whereNotNull('referrer')
            ->get(['referrer'])
            ->countBy(fn ($v) => parse_url($v->referrer, PHP_URL_HOST) ?: 'Direct')
            ->sortDesc()
            ->take(8)
            ->map(fn ($value, $label) => ['label' => $label, 'value' => $value])
            ->values();

        $ips = $base()
            ->selectRaw('ip, count(*) as hits, count(distinct path) as pages, min(visited_at) as first_seen, max(visited_at) as last_seen, max(device) as device, max(browser) as browser, max(os) as os, max(locale) as locale, max(is_bot) as is_bot')
            ->groupBy('ip')
            ->orderBy($sort, $dir)
            ->paginate(15, pageName: 'vpage')
            ->withQueryString();

        $recent = $base()
            ->orderByDesc('id')
            ->paginate(20, ['id', 'ip', 'path', 'device', 'browser', 'os', 'referrer', 'is_bot', 'visited_at'], 'rpage')
            ->withQueryString();

        $views = $base()->count();
        $uniqueIps = $base()->distinct()->count('ip');

        // Drill-down for one visitor: all-time, ignores the other filters.
        $visitor = null;
        if ($ip = $request->query('visitor')) {
            $visits = $all()->where('ip', $ip)->orderByDesc('id')->limit(200)->get(['id', 'path', 'device', 'browser', 'os', 'locale', 'referrer', 'is_bot', 'visited_at']);
            $visitor = [
                'ip' => $ip,
                'total' => $all()->where('ip', $ip)->count(),
                'first_seen' => $all()->where('ip', $ip)->min('visited_at'),
                'last_seen' => $all()->where('ip', $ip)->max('visited_at'),
                'visits' => $visits,
                'pages' => $visits->countBy('path')->sortDesc()->map(fn ($v, $k) => ['label' => $k, 'value' => $v])->values()->take(8),
            ];
        }

        $options = fn (string $col) => $all()->whereBetween('visited_at', [$since, $until])->whereNotNull($col)->distinct()->orderBy($col)->pluck($col);

        return Inertia::render('Admin/Dashboard', [
            'filters' => $filters + ['custom' => $custom],
            'sort' => ['by' => $sort, 'dir' => $dir],
            'options' => [
                'device' => $options('device'),
                'browser' => $options('browser'),
                'os' => $options('os'),
                'locale' => $options('locale'),
                'path' => $options('path'),
            ],
            'stats' => [
                'views' => $views,
                'uniqueIps' => $uniqueIps,
                'prevViews' => $previous()->count(),
                'prevUniqueIps' => $previous()->distinct()->count('ip'),
                'avgPages' => $uniqueIps ? round($views / $uniqueIps, 1) : 0,
                'today' => $all()->where('is_bot', false)->where('visited_at', '>=', now()->startOfDay())->count(),
                'onlineNow' => $all()->where('is_bot', false)->where('visited_at', '>=', now()->subMinutes(5))->distinct()->count('ip'),
                'bots' => $all()->where('is_bot', true)->whereBetween('visited_at', [$since, $until])->count(),
            ],
            'series' => $series,
            'hours' => collect(range(0, 23))->map(fn ($h) => ['label' => sprintf('%02d', $h), 'value' => (int) ($hours[$h] ?? 0)]),
            'pages' => $breakdown('path'),
            'devices' => $breakdown('device'),
            'browsers' => $breakdown('browser'),
            'systems' => $breakdown('os'),
            'locales' => $breakdown('locale'),
            'referrers' => $referrers,
            'ips' => $ips,
            'recent' => $recent,
            'visitor' => $visitor,
            'excludedIps' => config('admin.excluded_ips'),
        ]);
    }

    private function parseDate(mixed $value): ?Carbon
    {
        if (! is_string($value) || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return null;
        }

        try {
            return Carbon::createFromFormat('Y-m-d', $value)->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }
}
