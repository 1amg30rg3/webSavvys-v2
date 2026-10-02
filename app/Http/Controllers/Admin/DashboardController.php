<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $days = in_array((int) $request->query('range'), [1, 7, 30, 90], true) ? (int) $request->query('range') : 30;
        $includeBots = $request->boolean('bots');
        $ip = trim((string) $request->query('ip', ''));
        $since = now()->startOfDay()->subDays($days - 1);

        $base = fn (): Builder => Visit::query()
            ->where('visited_at', '>=', $since)
            ->when(! $includeBots, fn (Builder $q) => $q->where('is_bot', false))
            ->when($ip !== '', fn (Builder $q) => $q->where('ip', 'like', $ip.'%'));

        $perDay = $base()
            ->selectRaw('date(visited_at) as day, count(*) as views, count(distinct ip) as visitors')
            ->groupBy('day')
            ->pluck('views', 'day');
        $visitorsPerDay = $base()
            ->selectRaw('date(visited_at) as day, count(distinct ip) as visitors')
            ->groupBy('day')
            ->pluck('visitors', 'day');

        $series = [];
        for ($i = 0; $i < $days; $i++) {
            $day = Carbon::parse($since)->addDays($i)->toDateString();
            $series[] = [
                'date' => $day,
                'views' => (int) ($perDay[$day] ?? 0),
                'visitors' => (int) ($visitorsPerDay[$day] ?? 0),
            ];
        }

        $breakdown = fn (string $column, int $limit = 8) => $base()
            ->selectRaw("coalesce($column, 'Unknown') as label, count(*) as value")
            ->groupBy('label')
            ->orderByDesc('value')
            ->limit($limit)
            ->get();

        $hours = $base()
            ->selectRaw(DB::connection()->getDriverName() === 'sqlite'
                ? "cast(strftime('%H', visited_at) as integer) as hour, count(*) as value"
                : 'hour(visited_at) as hour, count(*) as value')
            ->groupBy('hour')
            ->pluck('value', 'hour');

        $referrers = $base()
            ->whereNotNull('referrer')
            ->get(['referrer'])
            ->countBy(fn ($v) => parse_url($v->referrer, PHP_URL_HOST) ?: 'Direct')
            ->sortDesc()
            ->take(8)
            ->map(fn ($value, $label) => ['label' => $label, 'value' => $value])
            ->values();

        $ips = $base()
            ->selectRaw('ip, count(*) as hits, min(visited_at) as first_seen, max(visited_at) as last_seen, max(device) as device, max(browser) as browser, max(os) as os')
            ->groupBy('ip')
            ->orderByDesc('hits')
            ->limit(50)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'filters' => ['range' => $days, 'bots' => $includeBots, 'ip' => $ip],
            'stats' => [
                'views' => $base()->count(),
                'uniqueIps' => $base()->distinct()->count('ip'),
                'today' => Visit::where('is_bot', false)->where('visited_at', '>=', now()->startOfDay())->count(),
                'onlineNow' => Visit::where('is_bot', false)->where('visited_at', '>=', now()->subMinutes(5))->distinct()->count('ip'),
                'bots' => Visit::where('is_bot', true)->where('visited_at', '>=', $since)->count(),
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
            'recent' => $base()->orderByDesc('id')->limit(25)->get(['id', 'ip', 'path', 'device', 'browser', 'os', 'referrer', 'is_bot', 'visited_at']),
        ]);
    }
}
