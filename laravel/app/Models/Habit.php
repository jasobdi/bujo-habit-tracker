<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // for testing purposes
use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    use HasFactory; // for testing purposes

    protected $fillable = [
        'title', 
        'category_id', 
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
