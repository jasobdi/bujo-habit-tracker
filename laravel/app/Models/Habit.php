<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{

    protected $fillable = [
        'title', 
        'user_id', 
        'frequency', 
        'custom_days', 
        'start_date', 
        'end_date', 
        'repeat_interval'
    ];

    protected $casts = [
        'custom_days' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function categories() {
        return $this->belongsToMany(Category::class, 'category_habit');
    }
}
