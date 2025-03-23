<?php

namespace App\Models;

use Bootstrap\Column;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User as Authenticatable; // replaces Model
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\HasFactory; // for testing purposes
use Illuminate\Notifications\Notifiable; // send messages to users (maybe later)
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable // now inherits from Authenticatable instead of Model
{
    use HasFactory, Notifiable, HasApiTokens; 

    protected $fillable = [
        'email',
        'username',
        'password',
        'language',
        'time_format',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    static function validate(Request $request) {
        $post = $request->method() === 'POST';
        return $request->validate([
        'email' => [($post ? 'required' : 'sometimes'), 'email', 'unique:users,email'],
        'password' => [($post ? 'required' : 'sometimes'), 'min:8'], // specifics are defined in AuthController
        'username' => [($post ? 'required' : 'sometimes'), 'string', 'unique:users,username'],

        ]);
    }

     // lifecycle hook
    static function booted() {
        self::saving(function (User $user) {
            if (!preg_match('/^\$2y\$/', $user->password)) { // checks if pw is a bcrypt-Hash
                $user->password = Hash::make($user->password); // if not, hashes it
            }
        });
    }
}