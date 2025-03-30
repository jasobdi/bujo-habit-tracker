<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\AuthController;
use App\Models\User;

Route::prefix('api')->group(function () {

    // guest endpoints
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // user endpoints 
    Route::middleware('auth:sanctum')->group(function () {

        // LOGOUT
        Route::post('/logout', [AuthController::class, 'logout']);
    
        // USERS
        Route::get('/users', [UserController::class, 'index']);
        // 'create' is 'register' in AuthController
        Route::patch('/users', [UserController::class, 'update']);
        Route::delete('/users', [UserController::class, 'delete']);

        // CATEGORIES
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'create']);
        Route::patch('/categories', [CategoryController::class, 'update']);
        Route::delete('/categories', [CategoryController::class, 'delete']);

        // HABITS
        Route::get('/habits', [HabitController::class, 'index']);
        Route::get('/habits/{id}', [HabitController::class, 'show']);
        Route::post('/habits', [HabitController::class, 'create']);
        Route::patch('/habits/{id}', [HabitController::class, 'update']);
        Route::delete('/habits/{id}', [HabitController::class, 'delete']);

        // JOURNALS
        Route::get('/journals', [JournalController::class, 'index']);
        Route::post('/journals', [JournalController::class, 'create']); 
        Route::patch('/journals', [JournalController::class, 'update']);
        Route::delete('/journals', [JournalController::class, 'delete']);


    });
});


