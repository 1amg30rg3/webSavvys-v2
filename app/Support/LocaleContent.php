<?php

namespace App\Support;

class LocaleContent
{
    /**
     * Reads the same JSON files the Vue app uses for i18n (resources/js/i18n),
     * so SEO copy has one source of truth. Needed because the meta/JSON-LD
     * tags in app.blade.php are rendered in pure PHP — they must work even
     * when the Inertia SSR pipeline isn't running (e.g. shared hosting with
     * no persistent Node process), which is when non-JS crawlers (Facebook,
     * Instagram, WhatsApp, Telegram) see the raw HTML response.
     */
    public static function load(string $locale): array
    {
        static $cache = [];

        if (isset($cache[$locale])) {
            return $cache[$locale];
        }

        $path = resource_path("js/i18n/{$locale}.json");

        if (! is_file($path)) {
            return $cache[$locale] = [];
        }

        return $cache[$locale] = json_decode(file_get_contents($path), true) ?? [];
    }
}
