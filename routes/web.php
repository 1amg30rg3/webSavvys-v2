<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\AdminAuth;
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

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AuthController::class, 'show'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('login.store');

    Route::middleware(AdminAuth::class)->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    });
});
