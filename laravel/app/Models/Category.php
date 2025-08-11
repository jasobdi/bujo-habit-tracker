<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Habit;

class Category extends Model
{
    protected $fillable = ['title', 'user_id'];

    public function habits() {
        return $this->belongsToMany(Habit::class, 'category_habit');
    }

}
