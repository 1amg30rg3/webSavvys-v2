<?php
    $seoLocale = app()->getLocale();
    $seoConfig = config('seo');
    $seoI18n = \App\Support\LocaleContent::load($seoLocale);
    $seoCopy = $seoI18n['seo'] ?? [];

    $seoTitle = ($seoCopy['title'] ?? config('app.name')) . ' - ' . $seoConfig['site_name'];
    $seoDescription = $seoCopy['description'] ?? '';
    $seoKeywords = implode(', ', $seoCopy['keywords'] ?? []);

    $seoLocaleConfig = $seoConfig['locales'][$seoLocale] ?? $seoConfig['locales'][$seoConfig['default_locale']];
    $seoCanonical = $seoConfig['url'].$seoLocaleConfig['path'];
    $seoImageUrl = $seoConfig['url'].($seoLocaleConfig['image'] ?? $seoConfig['default_image']);

    $seoJsonLd = [
        [
            '@context' => 'https://schema.org',
            '@type' => 'ProfessionalService',
            'name' => $seoConfig['organization']['name'],
            'url' => $seoConfig['url'].'/',
            'logo' => $seoConfig['url'].$seoConfig['organization']['logo'],
            'image' => $seoImageUrl,
            'description' => $seoDescription,
            'areaServed' => $seoConfig['organization']['area_served'],
            'founder' => [
                '@type' => 'Person',
                'name' => $seoConfig['organization']['founder'],
                'jobTitle' => $seoI18n['developer']['role'] ?? null,
            ],
            ...(count($seoConfig['social'])
                ? ['sameAs' => array_values(array_map(fn ($s) => $s['url'], $seoConfig['social']))]
                : []),
        ],
        [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => $seoConfig['site_name'],
            'url' => $seoConfig['url'].'/',
            'inLanguage' => $seoLocale,
        ],
        [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => array_map(fn ($item) => [
                '@type' => 'Question',
                'name' => $item['q'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $item['a'],
                ],
            ], $seoI18n['faq']['items'] ?? []),
        ],
    ];
?><!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <!-- DNS Prefetch for Performance -->
        <link rel="dns-prefetch" href="//fonts.googleapis.com">
        <link rel="dns-prefetch" href="//fonts.gstatic.com">

        <title inertia>{{ $seoTitle }}</title>

        <meta name="description" content="{{ $seoDescription }}">
        @if ($seoKeywords)
            <meta name="keywords" content="{{ $seoKeywords }}">
        @endif
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ $seoCanonical }}">

        @foreach ($seoConfig['locales'] as $code => $cfg)
            <link rel="alternate" hreflang="{{ $code }}" href="{{ $seoConfig['url'].$cfg['path'] }}">
        @endforeach
        <link rel="alternate" hreflang="x-default" href="{{ $seoConfig['url'].$seoConfig['locales'][$seoConfig['default_locale']]['path'] }}">

        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoCanonical }}">
        <meta property="og:site_name" content="{{ $seoConfig['site_name'] }}">
        <meta property="og:image" content="{{ $seoImageUrl }}">
        <meta property="og:image:width" content="{{ $seoConfig['default_image_width'] }}">
        <meta property="og:image:height" content="{{ $seoConfig['default_image_height'] }}">
        <meta property="og:image:alt" content="{{ $seoTitle }}">
        <meta property="og:locale" content="{{ $seoLocaleConfig['og_locale'] }}">
        @foreach ($seoConfig['locales'] as $code => $cfg)
            @continue($code === $seoLocale)
            <meta property="og:locale:alternate" content="{{ $cfg['og_locale'] }}">
        @endforeach

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImageUrl }}">
        @if ($seoConfig['twitter_handle'])
            <meta name="twitter:site" content="{{ $seoConfig['twitter_handle'] }}">
        @endif

        @foreach ($seoJsonLd as $schema)
            {{-- Escape `<` so a stray closing-script-tag sequence inside any JSON-LD
                 string value can't break out of this script element. --}}
            <script type="application/ld+json">{!! str_replace('<', '\\u003c', json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) !!}</script>
        @endforeach

        <!-- Theme -->
        <meta name="theme-color" content="#ff6a5b">

        <!-- Favicons -->
        <link rel="icon" href="/favicon.png" type="image/png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <!-- Preconnect + Fonts (page-independent, loaded once for every route) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">

        <!-- Security Headers -->
        <meta name="referrer" content="strict-origin-when-cross-origin">

        @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
