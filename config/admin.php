<?php

return [
    // Password for the /admin visitor analytics area. Leave empty to disable login.
    'password' => env('ADMIN_PASSWORD'),

    // Contact form requests are emailed here. Leave empty to turn the email off.
    'leads_email' => env('ADMIN_LEADS_EMAIL', 'contact@websavvys.com'),

    // IPs that are never tracked and are hidden from the dashboard (comma-separated in .env).
    'excluded_ips' => array_values(array_filter(array_map('trim', explode(',', (string) env('ADMIN_EXCLUDED_IPS', '188.129.130.204,91.151.136.138'))))),
];
