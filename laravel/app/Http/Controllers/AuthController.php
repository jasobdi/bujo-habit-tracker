<?php 

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'username' => 'required',
            'password' => [
            'required',
            'string',
            Password::min(8) // min 8 characters
                ->max(16) // max 16 characters
                ->mixedCase() // upper & lowercase
                ->numbers() // min 1 number
                ->symbols(), // min 1 special character
        ], [ 
            // error messages for invalid password
            'password.min' => 'Password must be at least 8 characters',
            'password.max' => 'Password must not be greater than 16 characters',
            'password.mixed_case' => 'Password must contain upper and lower case characters',
            'password.numbers' => 'Password must contain at least 1 number',
            'password.symbols' => 'Password must contain at least 1 special character'
        ]
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
    
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Auth::attempt() failed',
                'credentials' => $credentials,
                'user' => User::where('email', $credentials['email'])->first()
            ], 401);
        }
    
        // select User by email
        $user = User::where('email', $credentials['email'])->first();
    
        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ]);
    }
}