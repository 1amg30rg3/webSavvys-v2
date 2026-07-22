<?php

namespace App\Http\Controllers;

class SitemapController extends Controller
{
    public function index()
    {
        $baseUrl = config('seo.url');
        $locales = config('seo.locales');
        $pages = config('seo.pages');

        $urls = [];

        foreach ($pages as $page) {
            foreach ($page['alternates'] as $locale) {
                $urls[] = [
                    'loc' => $baseUrl.$locales[$locale]['path'],
                    'changefreq' => $page['changefreq'],
                    'priority' => $page['priority'],
                    'alternates' => collect($page['alternates'])
                        ->mapWithKeys(fn ($code) => [$code => $baseUrl.$locales[$code]['path']])
                        ->all(),
                ];
            }
        }

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'text/xml');
    }
}
