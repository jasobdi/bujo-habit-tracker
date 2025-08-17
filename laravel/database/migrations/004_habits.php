<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the habits table.
 * 
 * This table is used to store user habits.
 * Each habit is linked to a user, and when a user is deleted,
 * all their habits will also be deleted.
 */

return new class extends Migration
{

    public function up()
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // deletes all habits when user is deleted
            $table->string('frequency'); // "daily", "weekly", "monthly", "custom"
            $table->integer('repeat_interval')->default(1); // every X days, weeks, months, etc.
            $table->json('custom_days')->nullable(); // optional
            $table->date('start_date');
            $table->date('end_date')->nullable(); // optional 
            $table->timestamps(); // not relevant but for consistency
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
