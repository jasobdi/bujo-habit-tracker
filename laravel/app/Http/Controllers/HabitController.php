<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    // READ ALL
    public function index()
    {
        $user = Auth::user(); // get logged in user
        $habits = Habit::where('user_id', $user->id)->get(); // get all habits from this user
        return response()->json($habits);
    }

    // READ BY ID
    public function show($id)
    {
        $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$habit) {
            // if the habit does not belong to the user, return 404 not found
            return response()->json(['message' => 'Habit not found'], 404);
        }
        return response()->json($habit);
    }

    // CREATE
    public function create(Request $request)
    {
        $validated = $request->validate(
            [
                'title' => 'required|string|max:50',
                'category_id' => 'required|exists:categories,id',
                'frequency' => 'required|in:daily,weekly,monthly,custom',
                // repeat_interval only IF frequency is daily, weekly or monthly
                'repeat_interval' => 'required_if:frequency,daily,weekly,monthly|integer|min:1',

                // custom_days only IF frequency is 'custom'
                'custom_days' => 'required_if:frequency,custom|array|min:1',
                'custom_days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',

                'start_date' => 'required|date',
                
                'end_type' => 'required|in:none,date,count',
                // end_date only IF end_type is 'date'
                'end_date' => 'required_if:end_type,date|nullable|date|after_or_equal:start_date',
                // end_count only IF end_type is 'count'
                'end_count' => 'required_if:end_type,count|nullable|integer|min:1',

                
            ]
            // ,[custom error messages]
        );

        $habit = Habit::create([
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'user_id' => Auth::id(),
            'frequency' => $validated['frequency'],
            'repeat_interval' => $validated['repeat_interval'],
            'custom_days' => $validated['custom_days'] ?? null,
            'start_date' => $validated['start_date'],
            'end_type' => $validated['end_type'],
            'end_date' => $validated['end_date'] ?? null,
            'end_count' => $validated['end_count'] ?? null,
            
        ]);

        return response()->json([
            'message' => 'Habit created successfully',
            'habit' => $habit
        ], 201);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$habit) {
            return response()->json(['message' => 'Habit not found'], 404);
        }

        $validated = $request->validate([
        'title' => 'sometimes|string|max:255',
        'category_id' => 'sometimes|exists:categories,id',
        'frequency' => 'sometimes|in:daily,weekly,monthly,custom',
        'repeat_interval' => 'sometimes|integer|min:1',
        'custom_days' => 'sometimes|array|min:1',
        'custom_days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
        'start_date' => 'sometimes|date',
        'end_type' => 'sometimes|in:none,date,count',
        'end_date' => 'required_if:end_type,date|nullable|date|after_or_equal:start_date',
        'end_count' => 'required_if:end_type,count|nullable|integer|min:1',
        ]);

        $habit->update($validated);
        return response()->json([
            'message' => 'Habit updated successfully',
            'habit' => $habit
        ]);
    }
    // DELETE
    public function delete($id)
    {
        $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first(); // get habit by id and user_id
        if (!$habit) {
            return response()->json(['message' => 'Habit not found'], 404); // return 404 if habit not found
        }
        $habit->delete(); // delete habit
        return response()->json(['message' => 'Habit deleted successfully']);
    }
}
