<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NasaController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Landing', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('landing');

// Alias for /landing if user navigates directly to it
Route::get('/landing', function () {
    return Inertia::render('Landing', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
});

Route::get('/explore', function () {
    // Always show loading screen flow from /explore route
    // Pass user as null to trigger loading->auth flow
    // Add timestamp to force re-render on every visit
    return Inertia::render('Home', [
        'auth' => [
            'user' => null,
        ],
        'forceLoading' => true, // Flag to always show loading
        'timestamp' => time(), // Force fresh state on every request
    ]);
})->name('explore');

Route::get('/home', function () {
    return Inertia::render('Home', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->middleware('auth')->name('home');

// Authentication Routes
Route::get('/login', function () {
    return Inertia::render('AuthPage', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('login');

Route::get('/register', function () {
    return Inertia::render('AuthPage', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('register');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Google OAuth Routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/callback/google', [AuthController::class, 'handleGoogleCallback']);

// NASA API Routes
Route::prefix('api')->group(function () {
    Route::get('/nasa/apod', [NasaController::class, 'getAstronomyPictureOfDay']);
    Route::get('/nasa/epic', [NasaController::class, 'getEpicImages']);
    Route::get('/nasa/mars-photos', [NasaController::class, 'getMarsPhotos']);
    Route::get('/nasa/neo', [NasaController::class, 'getNearEarthObjects']);
});

// User Interaction Routes (CRUD)
Route::middleware(['web'])->group(function () {
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);
    
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback', [FeedbackController::class, 'index']);
});
