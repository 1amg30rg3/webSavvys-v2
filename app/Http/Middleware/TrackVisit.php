<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use App\Support\UserAgent;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TrackVisit
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Record after the response is sent so tracking never slows a page down.
     */
    public function terminate(Request $request, Response $response): void
    {
        if (! $request->isMethod('GET') || $request->is('admin', 'admin/*', 'up', 'sitemap.xml')
            || $request->header('X-Inertia') && $request->header('X-Inertia-Partial-Data')
            || $response->getStatusCode() >= 400
            || $response->isRedirection()) {
            return;
        }

        $ua = $request->userAgent();

        try {
            Visit::create([
                'ip' => $request->ip(),
                'path' => mb_substr('/'.ltrim($request->path(), '/'), 0, 255),
                'locale' => app()->getLocale(),
                'referrer' => $request->headers->get('referer') ? mb_substr($request->headers->get('referer'), 0, 255) : null,
                'user_agent' => $ua ? mb_substr($ua, 0, 500) : null,
                ...UserAgent::parse($ua),
                'visited_at' => now(),
            ]);
        } catch (Throwable $e) {
            report($e);
        }
    }
}
