<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the journals table.
 * 
 * This table is used to store journal entries for users.
 * Each journal entry is linked to a user, and when a user is deleted,
 * all their journal entries will also be deleted.
 * 
 * At the moment Journals is not used or displayed in the frontend as it is not part of the MVP.
 */

return new class extends Migration
{

    public function up()
    {
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('entry');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // deletes all journals when user is deleted
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
