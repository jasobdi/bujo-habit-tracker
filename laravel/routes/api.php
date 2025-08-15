<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabitCompletionController;

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
        Route::get('/users/{id}', [UserController::class, 'show']);
        // 'create' is 'register' in AuthController
        Route::patch('/user', [UserController::class, 'update']);
        Route::delete('/user', [UserController::class, 'delete']);

        // CATEGORIES
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{id}', [CategoryController::class, 'show']);
        Route::post('/categories', [CategoryController::class, 'create']);
        Route::patch('/categories/{id}', [CategoryController::class, 'update']);
        Route::get('/categories/{id}/usage', [CategoryController::class, 'usage']);
        Route::delete('/categories/{id}', [CategoryController::class, 'delete']);

        // HABITS
        Route::get('/habits', [HabitController::class, 'index']);
        Route::get('/habits/{id}', [HabitController::class, 'show']);
        Route::post('/habits', [HabitController::class, 'create']);
        Route::patch('/habits/{id}', [HabitController::class, 'update']);
        Route::delete('/habits/{id}', [HabitController::class, 'delete']);

        // HABIT COMPLETIONS (checkboxes)
        Route::post('/habit-completions', [HabitCompletionController::class, 'store']);
        Route::delete('/habit-completions', [HabitCompletionController::class, 'destroy']);
        Route::get('/habit-completions/daily', [HabitCompletionController::class, 'daily']);
        Route::get('/habit-completions/monthly', [HabitCompletionController::class, 'monthly']);

        // JOURNALS
        Route::get('/journals', [JournalController::class, 'index']);
        Route::get('/journals/{id}', [JournalController::class, 'show']);
        Route::post('/journals', [JournalController::class, 'create']); 
        Route::patch('/journals/{id}', [JournalController::class, 'update']);
        Route::delete('/journals/{id}', [JournalController::class, 'delete']);


    });
});


