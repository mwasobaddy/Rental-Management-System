<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => false, // Disabled - using Google OAuth only
    ]);
})->name('home');

// Google OAuth routes
Route::get('auth/google', [App\Http\Controllers\GoogleController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('auth/google/callback', [App\Http\Controllers\GoogleController::class, 'handleGoogleCallback'])->name('google.callback');



// Profile setup routes (require auth but not subscription)
Route::middleware(['auth', 'verified'])->prefix('profile')->name('profile.')->group(function () {
    Route::get('/setup', [App\Http\Controllers\ProfileController::class, 'setup'])->name('setup');
    Route::post('/complete', [App\Http\Controllers\ProfileController::class, 'complete'])->name('complete');
    Route::post('/password-strength', [App\Http\Controllers\ProfileController::class, 'checkPasswordStrength'])->name('password.strength');
    Route::get('/link-google', [App\Http\Controllers\ProfileController::class, 'linkGoogle'])->name('link.google');
    
    // Property setup routes
    Route::get('/property/setup', [App\Http\Controllers\ProfileController::class, 'propertySetup'])->name('property.setup');
    Route::post('/property/complete', [App\Http\Controllers\ProfileController::class, 'completePropertySetup'])->name('property.complete');
});

// Subscription routes (require auth but not subscription)
Route::middleware(['auth', 'verified'])->prefix('subscription')->name('subscription.')->group(function () {
    Route::get('/', [App\Http\Controllers\SubscriptionController::class, 'index'])->name('index');
    Route::get('/select/{tierSlug}', [App\Http\Controllers\SubscriptionController::class, 'select'])->name('select');
    Route::post('/subscribe', [App\Http\Controllers\SubscriptionController::class, 'subscribe'])->name('subscribe');
    Route::post('/trial', [App\Http\Controllers\SubscriptionController::class, 'startTrial'])->name('trial');
    Route::post('/cancel', [App\Http\Controllers\SubscriptionController::class, 'cancel'])->name('cancel');
});

Route::middleware(['auth', 'verified', 'profile.complete', 'subscription'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
