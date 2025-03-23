<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('entry');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); // deletes all journals when category is deleted
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // deletes all journals when user is deleted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
