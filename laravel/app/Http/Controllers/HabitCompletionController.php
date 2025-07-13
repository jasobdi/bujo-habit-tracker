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

        $user = Auth::user();

        $deleted = HabitCompletion::where('habit_id', $validated['habit_id'])
            ->where('date', $validated['date'])
            ->where('user_id', $user->id)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Completion deleted.']);
        } else {
            return response()->json(['message' => 'No completion found.'], 404);
        }
    }

    // get completions for current month
    public function monthly(Request $request)
    {
        $user = Auth::user();

        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        $startOfMonth = \Carbon\Carbon::create($year, $month, 1)->startOfDay();
        $endOfMonth = \Carbon\Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

        $completions = HabitCompletion::where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        return response()->json($completions);
    }

    public function date(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $user = Auth::user();

        $completions = HabitCompletion::where('user_id', $user->id)
            ->whereDate('date', $request->input('date'))
            ->get();

        return response()->json($completions);
    }
}
