<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HabitCompletion;
use Illuminate\Support\Facades\Auth;

class HabitCompletionController extends Controller
{
    // Mark as completed & safe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'habit_id' => 'required|exists:habits,id',
            'date' => 'required|date',
        ]);

        $user = Auth::user();

        $completion = HabitCompletion::updateOrCreate(
            [
                'habit_id' => $validated['habit_id'],
                'date' => $validated['date'],
            ],
            [
                'user_id' => $user->id,
            ]
        );

        return response()->json($completion, 201);
    }

    // Unmark as completed, "delete" data from HabitCompletion
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'habit_id' => 'required|exists:habits,id',
            'date' => 'required|date',
        ]);

        $deleted = HabitCompletion::where('habit_id', $validated['habit_id'])
            ->where('date', $validated['date'])
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Completion deleted.']);
        } else {
            return response()->json(['message' => 'No completion found.'], 404);
        }
    }

    // get completions for specific day
    public function daily(Request $request)
    {

        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);
        $day = $request->input('day', now()->day);
        
        $startOfDay = \Carbon\Carbon::create($year, $month, $day);
        $dateString = $startOfDay->format('Y-m-d');
        
        $completions = HabitCompletion::where('date', $dateString)
            ->get();

        return response()->json($completions);
    }
    
    // get completions for specific month
    public function monthly(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        $startOfMonth = \Carbon\Carbon::create($year, $month, 1)->startOfDay();
        $endOfMonth = \Carbon\Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

        $completions = HabitCompletion::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        return response()->json($completions);
    }
}
