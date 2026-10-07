<?php

return [

    // Currency shown per locale.
    'currencies' => [
        'en' => 'usd',
        'ka' => 'gel',
    ],

    // Starting prices per website type. Keys match pricing.types[].key in
    // resources/js/i18n; null renders "Custom pricing".
    'types' => [
        'landing' => ['gel' => 250, 'usd' => 100],
        'business' => ['gel' => 750, 'usd' => 300],
        'ecommerce' => ['gel' => 1500, 'usd' => 600],
        'webapp' => ['gel' => null, 'usd' => null],
    ],

];
