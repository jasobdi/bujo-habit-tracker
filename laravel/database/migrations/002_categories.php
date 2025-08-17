<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the categories table.
 * 
 * This table is used to categorize habits.
 * Each category is linked to a user, and when a user is deleted,
 * all their categories will also be deleted.
 */

return new class extends Migration
{

    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // delets all categories when user is deleted
            $table->timestamps(); // not relevant but for consistency
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
