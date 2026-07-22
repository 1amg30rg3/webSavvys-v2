<?php

return [

    // Canonical production domain. Falls back to APP_URL for local/staging.
    'url' => rtrim(env('SEO_URL', env('APP_URL', 'https://websavvys.com')), '/'),

    'site_name' => 'WebSavvys',

    'twitter_handle' => env('SEO_TWITTER_HANDLE', '@websavvys'),

    // Default social preview image, relative to the public root.
    'default_image' => '/og-image.jpg',
    'default_image_width' => 1200,
    'default_image_height' => 630,

    // Named social profiles. Populate the env vars with real URLs only — never
    // fabricate placeholders here. Each entry needs an `icon` (fontawesome brand
    // icon name, already imported in app.ts) so the footer can render it.
    'social' => array_filter([
        'instagram' => env('SEO_SOCIAL_INSTAGRAM') ? ['url' => env('SEO_SOCIAL_INSTAGRAM'), 'icon' => 'instagram', 'label' => 'Instagram'] : null,
        'facebook' => env('SEO_SOCIAL_FACEBOOK') ? ['url' => env('SEO_SOCIAL_FACEBOOK'), 'icon' => 'facebook', 'label' => 'Facebook'] : null,
        'linkedin' => env('SEO_SOCIAL_LINKEDIN') ? ['url' => env('SEO_SOCIAL_LINKEDIN'), 'icon' => 'linkedin', 'label' => 'LinkedIn'] : null,
        'github' => env('SEO_SOCIAL_GITHUB') ? ['url' => env('SEO_SOCIAL_GITHUB'), 'icon' => 'github', 'label' => 'GitHub'] : null,
        'x' => env('SEO_SOCIAL_X') ? ['url' => env('SEO_SOCIAL_X'), 'icon' => 'x-twitter', 'label' => 'X (Twitter)'] : null,
    ]),

    // Organization / schema.org info. No physical address (remote/international
    // business) — see Organization schema in Welcome.vue.
    'organization' => [
        'name' => 'WebSavvys',
        'founder' => 'Giorgi Gavasheli',
        'logo' => '/apple-touch-icon.png',
        'area_served' => ['Georgia', 'Worldwide'],
    ],

    // Supported locales, used for hreflang generation and the sitemap. Keep in
    // sync with resources/js/i18n (en.json / ka.json) and routes/web.php.
    // `image` is the locale-specific OG/Twitter preview (see
    // scripts/generate-social-images.mjs) — falls back to `default_image` if
    // a locale doesn't have its own.
    'locales' => [
        'en' => ['path' => '/', 'og_locale' => 'en_US', 'image' => '/og-image.jpg'],
        'ka' => ['path' => '/ka', 'og_locale' => 'ka_GE', 'image' => '/og-image-ka.jpg'],
    ],
    'default_locale' => 'en',

    // Declarative sitemap entries. Add one entry per real, indexable route —
    // this is the whole "new pages get a sitemap entry automatically" system.
    // `alternates` should list every locale this route is available in.
    'pages' => [
        [
            'route' => 'home',
            'changefreq' => 'weekly',
            'priority' => '1.0',
            'alternates' => ['en', 'ka'],
        ],
    ],

];
