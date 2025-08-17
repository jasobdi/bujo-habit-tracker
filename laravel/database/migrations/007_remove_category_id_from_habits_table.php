<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for removing the category_id column from the habits table.
 */

return new class extends Migration
{
    public function up()
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }

    public function down()
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
        });
    }


};
