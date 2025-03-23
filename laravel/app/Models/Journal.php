<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // for testing purposes
use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    use HasFactory; // for testing purposes
    protected $fillable = ['title', 'entry', 'category_id', 'user_id']; 
    
}
