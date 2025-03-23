<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    public function index()
{
    $user = Auth::user(); // get logged in user
    $habits = Habit::where('user_id', $user->id)->get(); // get all habits from this user
    return response()->json($habits);
}

    public function create(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'frequency' => 'required|in:daily,weekly,monthly,custom',
            'custom_days' => 'nullable|array',
            'custom_days.*' => 'string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'repeat_interval' => 'required|integer|min:1',
        ]);
        $habit = Habit::create([
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'user_id' => Auth::id(),
            'frequency' => $validated['frequency'],
            'custom_days' => $validated['custom_days'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'repeat_interval' => $validated['repeat_interval'],
        ]);

        return response()->json([
            'message' => 'Habit created successfully',
            'habit' => $habit
        ], 201);
    }

    public function update(Request $request, $id)
{
    $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first();
    if (!$habit) {
        return response()->json(['message' => 'Habit not found'], 404);
    }

    $validated = $request->validate([
        'title' => 'sometimes|string',
        'category_id' => 'sometimes|exists:categories,id',
        'frequency' => 'sometimes|in:daily,weekly,monthly,custom',
        'custom_days' => 'nullable|array',
        'custom_days.*' => 'string',
        'start_date' => 'sometimes|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'repeat_interval' => 'sometimes|integer|min:1',
    ]);

    $habit->update($validated);
    return response()->json([
        'message' => 'Habit updated successfully',
        'habit' => $habit
    ]);
}

    public function destroy($id)
    {
        $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first(); // get habit by id and user_id
        if (!$habit) {
            return response()->json(['message' => 'Habit not found'], 404); // return 404 if habit not found
        }
        $habit->delete(); // delete habit
        return response()->json(['message' => 'Habit deleted successfully']);
    }


}
