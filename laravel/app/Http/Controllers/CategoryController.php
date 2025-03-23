<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
{
    $user = Auth::user(); // get logged in user
    $categories = Category::where('user_id', $user->id)->get(); // get all habits from this user
    return response()->json($categories);
}

    public function create(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
    ]);

    $category = Category::create([
        'title' => $validated['title'],
        'user_id' => Auth::id(),
    ]);

    return response()->json([
        'message' => 'Category created successfully',
        'category' => $category
    ], 201);
}
}