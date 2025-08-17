<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the category_habit pivot table.
 * 
 * This table is used to link habits and categories.
 * Each habit can belong to multiple categories, and each category can have multiple habits.
 */


return new class extends Migration
{
    public function up()
    {
        Schema::create('category_habit', function (Blueprint $table) {
            $table->foreignId('habit_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
        
            $table->primary(['habit_id', 'category_id']);
        });
        
        
    }
};