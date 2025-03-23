<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); // deletes all habits when category is deleted
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // deletes all habits when user is deleted
            $table->string('frequency'); // "daily", "weekly", "monthly", "custom"
            $table->json('custom_days')->nullable(); // optional (nullable = can stay empty)
            $table->date('start_date');
            $table->date('end_date')->nullable(); // optional (nullable = can stay empty)
            $table->integer('repeat_interval')->default(1); // every X days, weeks, months, etc.
            $table->timestamps(); // not relevant but for consistency
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
