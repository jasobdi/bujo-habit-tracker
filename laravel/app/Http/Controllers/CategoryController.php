<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Habit;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CategoryController extends Controller
{
    // READ ALL
    public function index()
    {
        $user = Auth::user(); // get logged in user
        $categories = Category::where('user_id', $user->id)->get(); // get all habits from this user
        return response()->json($categories);
    }

    // READ BY ID
    public function show($id)
    {
        $category = Category::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$category) {
            // if category does not belong to user, return 404 not found
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    // CREATE
    public function create(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:25',
        ]);

        $category = Category::create([
            'title' => $validated['title'],
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201); // 201 = Created
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $category = Category::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:25'
        ]);

        $category->update($validated);
        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    // DELETE
    public function delete($id)
    {
        $category = Category::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // check if category is still in use
        $isUsed = Habit::where('category_id', $category->id)->exists()
            || Journal::where('category_id', $category->id)->exists();

        if ($isUsed) {
            return response()->json([
                'message' => 'Category is still in use and cannot be deleted.'
            ], 409); // 409 = Conflict
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
