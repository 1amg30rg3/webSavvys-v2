<?php

namespace App\Support;

class UserAgent
{
    /**
     * @return array{device: string, browser: string, os: string, is_bot: bool}
     */
    public static function parse(?string $ua): array
    {
        $ua ??= '';

        $isBot = (bool) preg_match('/bot|crawl|spider|slurp|facebookexternalhit|preview|headless|curl|wget|python|httpclient|monitor|lighthouse|embedly|whatsapp|telegram/i', $ua) || $ua === '';

        $device = match (true) {
            (bool) preg_match('/ipad|tablet|kindle|silk/i', $ua) => 'tablet',
            (bool) preg_match('/mobi|iphone|ipod|android/i', $ua) => 'mobile',
            default => 'desktop',
        };

        $browser = match (true) {
            (bool) preg_match('/edg(e|a|ios)?\//i', $ua) => 'Edge',
            (bool) preg_match('/opr\/|opera/i', $ua) => 'Opera',
            (bool) preg_match('/firefox|fxios/i', $ua) => 'Firefox',
            (bool) preg_match('/chrome|crios/i', $ua) => 'Chrome',
            (bool) preg_match('/safari/i', $ua) => 'Safari',
            default => 'Other',
        };

        $os = match (true) {
            (bool) preg_match('/windows/i', $ua) => 'Windows',
            (bool) preg_match('/android/i', $ua) => 'Android',
            (bool) preg_match('/iphone|ipad|ipod/i', $ua) => 'iOS',
            (bool) preg_match('/mac os|macintosh/i', $ua) => 'macOS',
            (bool) preg_match('/linux|x11/i', $ua) => 'Linux',
            default => 'Other',
        };

        return ['device' => $device, 'browser' => $browser, 'os' => $os, 'is_bot' => $isBot];
    }
}
