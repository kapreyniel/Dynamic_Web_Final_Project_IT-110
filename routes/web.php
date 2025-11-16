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
    return Inertia::render('Home');
})->name('home');

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Google OAuth Routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

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
