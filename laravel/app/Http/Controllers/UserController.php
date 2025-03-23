<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    function index() {
        return Auth::user();
    }

    // no create method - is very similar to register in AuthController

    public function update(Request $request)
{
    $user = Auth::user(); // get logged in user

    $validated = $request->validate([
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'username' => 'sometimes|string',
        'language' => 'sometimes|in:en,de,fr,it',
        'time_format' => 'sometimes|in:12h,24h',
    ]);

    $user->update($validated);

    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user
    ]);
}

    public function destroy()
    {
        $user = Auth::user();
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

}

