<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable; // replaces Model
use Illuminate\Database\Eloquent\Factories\HasFactory; // for testing purposes
use Illuminate\Notifications\Notifiable; // for notifications

class User extends Authenticatable // now inherits from Authenticatable instead of Model
{
    use HasFactory, Notifiable; 

    protected $fillable = [
        'email',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
