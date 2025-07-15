<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
