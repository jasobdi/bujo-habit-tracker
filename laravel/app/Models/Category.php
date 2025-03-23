<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // for testing purposes
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory; // for testing purposes
    protected $fillable = ['title', 'user_id'];
}
