<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\AuthController;
use App\Models\User;

Route::prefix('api')->group(function () {
Route::get('/users', [UserController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/habits', [HabitController::class, 'index']);
Route::get('/journals', [JournalController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
});

// guest endpoints (Zugriff ohne Login / Authentifizierung)


// user endpoints (Zugriff nur MIT Login / Authentifizierung)

