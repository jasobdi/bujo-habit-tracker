<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    // READ ALL HABITS
    public function index(Request $request)
    {
        // get logged in user
        $user = Auth::user();

        // get all habits with categories from this user
        $query = Habit::with('categories')
            ->where('user_id', $user->id);

        // FILTER by category 
        if ($request->has('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->input('category_id'));
            });
        }
        
        // FILTER by date
        if ($request->has('date')) {
            $date = \Carbon\Carbon::parse($request->input('date'));

            // start_date must be before or on the selected date
            $query->where('start_date', '<=', $date);

            // end_date must be after or on the selescted date
            $query->where(function ($q) use ($date) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            });
            // frequency is daily, weekly or monthly
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

        // FILTER by year & month
        if ($request->has('year') && $request->has('month')) {
            $year = $request->input('year');
            $month = $request->input('month');

            $startOfMonth = \Carbon\Carbon::create($year, $month, 1)->startOfDay();
            $endOfMonth = \Carbon\Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

            $query = $query->where('start_date', '<=', $endOfMonth)
                ->where(function ($q) use ($startOfMonth) {
                    $q->whereNull('end_date')
                        ->orWhere('end_date', '>=', $startOfMonth);
                });
        }

        $habits = $query->get();
        
        // CALCULATE active_dates for each habit (Dashboard)
        $habitsWithDates = $habits->map(function ($habit) use ($request) {
            $startDate = \Carbon\Carbon::parse($habit->start_date);
            $endDate = now();
            if ($request->has('date')) {
                $startDate = \Carbon\Carbon::parse($request->input('date'));
                $endDate = $startDate->copy()->endOfDay();
            } else if ($request->has('year') && $request->has('month')) {
                $startDate = \Carbon\Carbon::create($request->input('year'), $request->input('month'), 1);
                $endDate = $startDate->copy()->endOfMonth()->endOfDay();
            }
            $activeDates = [];

            if ($habit->frequency === "daily") {
                for ($date = $startDate->copy(); $date->lte($endDate); $date->addDays($habit->repeat_interval)) {
                    $activeDates[] = $date->toDateString();
                }
            } elseif ($habit->frequency === "weekly" && is_array($habit->custom_days)) {
                for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                    if (in_array($date->format('l'), $habit->custom_days)) {
                        $activeDates[] = $date->toDateString();
                    }
                }
            } elseif ($habit->frequency === "monthly") {
                for ($date = $startDate->copy(); $date->lte($endDate); $date->addMonthsNoOverflow($habit->repeat_interval)) {
                    $activeDates[] = $date->toDateString();
                }
            } elseif ($habit->frequency === "custom") {
                for ($date = $startDate->copy(); $date->lte($endDate); $date->addDays($habit->repeat_interval)) {
                    $activeDates[] = $date->toDateString();
                }
            }

            // Add active_dates as extra field
            $habit->setAttribute('active_dates', $activeDates);
            return $habit;
        });

        return response()->json($habitsWithDates->values());
    }

    // READ BY ID
    public function show($id)
    {
        // get habit with categories by id and user_id
        $habit = Habit::with('categories')
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$habit) {
            // if the habit does not belong to the user, return 404 not found
            return response()->json(['message' => 'Habit not found'], 404);
        }
        return response()->json($habit);
    }

    // CREATE A HABIT
    public function create(Request $request)
    {

    // validation
    $validated = $request->validate([
        'title' => 'required|string|max:50',
        'frequency' => 'required|in:daily,weekly,monthly,custom',
        'start_date' => 'required|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'repeat_interval' => 'nullable|integer|min:1',
        'custom_days' => 'nullable|array',
        'custom_days.*' => 'string',
        'category_ids' => 'required|array|min:1',
        'category_ids.*' => 'integer|exists:categories,id',
    ]);

    // handle frequency and repeat_interval
    $frequency = $validated['frequency'];

    if ($frequency === 'custom' && !isset($validated['repeat_interval'])) {
        return response()->json(['message' => 'Repeat interval is required for custom frequency'], 422);
    }

    if ($frequency !== 'custom') {
        $validated['repeat_interval'] = 1;
    }

    // Set custom_days only for weekly or custom
    if (!in_array($validated['frequency'], ['weekly', 'custom'])) {
        $validated['custom_days'] = null;
    }

    // create habit
    $habit = Habit::create([
        'title' => $validated['title'],
        'user_id' => Auth::id(),
        'frequency' => $validated['frequency'],
        'start_date' => $validated['start_date'],
        'end_date' => $validated['end_date'] ?? null,
        'repeat_interval' => $validated['repeat_interval'],
        'custom_days' => $validated['custom_days'] ?? null,
    ]);

    // assign categories
    $habit->categories()->attach($validated['category_ids']);

    return response()->json([
        'message' => 'Habit created successfully',
        'habit' => $habit->load('categories')
    ], 201);
}

    // UPDATE A HABIT
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
            'frequency' => 'sometimes|in:daily,weekly,monthly,custom',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'repeat_interval' => 'nullable|integer|min:1',
            'custom_days' => 'nullable|array',
            'custom_days.*' => 'string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ]);

        // check & handle if frequency was set
        $frequency = $validated['frequency'] ?? $habit->frequency;

        // validate repeat_interval
        if ($frequency === 'custom' && !isset($validated['repeat_interval'])) {
            return response()->json(['message' => 'Repeat interval is required for custom frequency'], 422);
        } elseif ($frequency !== 'custom') {
            $validated['repeat_interval'] = 1;
        }

        // validate custom_days (only in weekly or custom frequency)
        if (!in_array($frequency, ['weekly', 'custom'])) {
            $validated['custom_days'] = null;
        }

        // update habit
        $habit->update($validated);

        // sync categories if category_ids are provided
        if (isset($validated['category_ids'])) {
            $habit->categories()->sync($validated['category_ids']);
        }
        
        return response()->json([
            'message' => 'Habit updated successfully',
            'habit' => $habit
        ]);
    }


    // DELETE A HABIT
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

