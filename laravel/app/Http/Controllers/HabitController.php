<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    // READ ALL
    public function index(Request $request)
    {
        // get logged in user
        $user = Auth::user();

        // get all habits from this user
        $query = Habit::where('user_id', $user->id);

        // filter by category 
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // filter by date
        if ($request->has('date')) {
            $date = \Carbon\Carbon::parse($request->input('date'));

            // start_date must be before or on the selected date
            $query->where('start_date', '<=', $date);

            // end_date must be after or on the selescted date
            $query->where(function ($q) use ($date) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            });
            // frequeny is daily, weekly or monthly
            $query->where(function ($q) use ($date) {
                $q->where('frequency', 'daily')
                    ->orWhere(function ($q2) use ($date) {
                        $q2->where('frequency', 'weekly')
                            ->whereJsonContains('custom_days', $date->format('l')); // l = weekday name (Monday)
                    })->orWhere(function ($q3) use ($date) {
                        $q3->where('frequency', 'monthly')
                            ->whereDay('start_date', '=', $date->day); // compare day of month
                    });
            });
        }

        // filter by month & year
        if ($request->has('year') && $request->has('month')) {
            $year = $request->input('year');
            $month = $request->input('month');
    
            $startOfMonth = \Carbon\Carbon::create($year, $month, 1)->startOfDay();
            $endOfMonth = \Carbon\Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();
    
            $query = $query->where('start_date', '<=', $endOfMonth)
                ->where(function($q) use ($startOfMonth) {
                    $q->whereNull('end_date')
                        ->orWhere('end_date', '>=', $startOfMonth);
                });
        }

        $habits = $query->get();

        return response()->json($habits);
    }

    // READ BY ID
    public function show($id)
    {
        // get habit by id and user_id
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
        // basic validation
        $validated = $request->validate([
            'title' => 'required|string|max:50',
            'category_id' => 'required|exists:categories,id',
            'frequency' => 'required|in:daily,weekly,monthly,custom',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // handle custom frequency
        if ($validated['frequency'] === 'custom') {
            $customValidated = $request->validate([
                'repeat_interval' => 'required|integer|min:1',
            ]);

            // if custom weekly -> validate days
            if ($request->filled('custom_days')) {
                $daysValidated = $request->validate([
                    'custom_days' => 'required|array|min:1',
                    'custom_days.*' => 'string',
                ]);
                $customValidated = array_merge($customValidated, $daysValidated);
            }

            $validated = array_merge($validated, $customValidated);
        } else {
            $validated['repeat_interval'] = 1;
            $validated['custom_days'] = null;
        }

        $habit = Habit::create([
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'user_id' => Auth::id(),
            'frequency' => $validated['frequency'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'repeat_interval' => $validated['repeat_interval'],
            'custom_days' => $validated['custom_days'] ?? null,
        ]);

        return response()->json([
            'message' => 'Habit created successfully',
            'habit' => $habit
        ], 201);
    }



    // UPDATE
    public function update(Request $request, $id)
    {
        // get habit by id and user_id
        $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first();

        // return 404 if habit not found
        if (!$habit) {
            return response()->json(['message' => 'Habit not found'], 404);
        }

        // basic validation
        $validated = $request->validate([
            'title' => 'sometimes|string|max:50',
            'category_id' => 'sometimes|exists:categories,id',
            'frequency' => 'sometimes|in:daily,weekly,monthly,custom',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'repeat_interval' => 'sometimes|integer|min:1',
            'custom_days' => 'nullable|array',
            'custom_days.*' => 'string'
        ]);

        // check & handle if frequency was set or already is 'custom'
        $isCustom = ($validated['frequency'] ?? $habit->frequency) === 'custom';

        if ($isCustom) {
            if ($request->filled('repeat_interval')) {
                $request->validate([
                    'repeat_interval' => 'required|integer|min:1',
                ]);
            }

            if ($request->filled('custom_days')) {
                $request->validate([
                    'custom_days' => 'required|array|min:1',
                    'custom_days.*' => 'string',
                ]);
            }
        } else {
            $validated['repeat_interval'] = 1;
            $validated['custom_days'] = null;
        }

        $habit->update($validated);

        return response()->json([
            'message' => 'Habit updated successfully',
            'habit' => $habit
        ]);
    }


    // DELETE
    public function delete($id)
    {
        // get habit by id and user_id
        $habit = Habit::where('id', $id)->where('user_id', Auth::id())->first();

        // return 404 if habit not found
        if (!$habit) {
            return response()->json(['message' => 'Habit not found'], 404);
        }
        // delete habit
        $habit->delete();

        // success-message
        return response()->json(['message' => 'Habit deleted successfully']);
    }
}
