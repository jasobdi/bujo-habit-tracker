<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()  // creates Table 'users' in Database
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('username');
            $table->string('password');
            $table->string('date_format')->default('dd/mm/yyyy');
            $table->timestamps();
        });
    }

    // removes Table 'users' from Database & all Data linked to it
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
