<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    App::setLocale('en');

    return Inertia::render('Welcome', ['routeLocale' => 'en']);
})->name('home');

Route::get('/ka', function () {
    App::setLocale('ka');

    return Inertia::render('Welcome', ['routeLocale' => 'ka']);
})->name('home.ka');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
