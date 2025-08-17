<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HabitCompletion extends Model
{

    protected $fillable = ['habit_id', 'date'];

    public function habit() {
        return $this->belongsTo(Habit::class);
    }
}
