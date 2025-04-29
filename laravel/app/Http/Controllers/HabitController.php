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

            // start_date must be before or on the date
            $query->where('start_date', '<=', $date);

            // end_date must be after or on the date
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
                    }) ->orWhere(function ($q3) use ($date) {
                        $q3->where('frequency', 'monthly')
                            ->whereDay('start_date', '=', $date->day); // compare day of month
                    });
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
        ]);

        // custom frequency validation
        if ($validated['frequency'] === 'custom') {
            $customValidated = $request->validate([
                'custom_type' => 'required|in:daily,weekly,monthly,yearly',
                'repeat_interval' => 'required|integer|min:1',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            // custom days validation if custom_type is weekly
            if (in_array($request->input('custom_type'), ['weekly'])) {
                $daysValidated = $request->validate([
                    'custom_days' => 'required|array|min:1',
                    'custom_days.*' => 'string',
                ]);
                // array: includes validation for custom frequency & custom days
                $customValidated = array_merge($customValidated, $daysValidated);
            }
            // array: includes validation for custom frequecy, custom days & basic validation
            $validated = array_merge($validated, $customValidated);
        }

        // validation if frequency is not custom
        if ($validated['frequency'] !== 'custom') {
            $validated['repeat_interval'] = 1;
        }

        // data-array for database
        $data = [
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'user_id' => Auth::id(),
            'frequency' => $validated['frequency'],
            'start_date' => $validated['start_date'],
            'end_date' => $request->input('end_date'),
            'repeat_interval' => $validated['repeat_interval'],
        ];

        // only insert custom_type & custom_days into database, if filled in
        if ($request->filled('custom_type')) {
            $data['custom_type'] = $request->input('custom_type');
        }

        if ($request->filled('custom_days')) {
            $data['custom_days'] = $request->input('custom_days');
        }

        // create habit
        $habit = Habit::create($data);

        // success-message
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

        // if the habit does not belong to the user, return 404 not found
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
        ]);

        // custom frequency validation
        if (($validated['frequency'] ?? $habit->frequency) === 'custom') {
            $customValidated = $request->validate([
                'custom_type' => 'required|in:daily,weekly,monthly,yearly',
                'repeat_interval' => 'required|integer|min:1',
            ]);

            // custom days validation if custom_type is weekly
            if (in_array($request->input('custom_type'), ['weekly'])) {
                $daysValidated = $request->validate([
                    'custom_days' => 'required|array|min:1',
                    'custom_days.*' => 'string',
                ]);
                // array: includes validation for custom frequency & custom days
                $customValidated = array_merge($customValidated, $daysValidated);
            }
            // array: includes validation for custom frequecy, custom days & basic validation
            $validated = array_merge($validated, $customValidated);
        }

        //  // validation if frequency is not custom
        if (($validated['frequency'] ?? $habit->frequency) !== 'custom') {
            $validated['repeat_interval'] = 1;
            $validated['custom_type'] = null;
            $validated['custom_days'] = null;
        }

        // data-array for database
        $data = [];

        // only update fields if they were changed
        if (isset($validated['title'])) {
            $data['title'] = $validated['title'];
        }
        if (isset($validated['category_id'])) {
            $data['category_id'] = $validated['category_id'];
        }
        if (isset($validated['frequency'])) {
            $data['frequency'] = $validated['frequency'];
        }
        if (isset($validated['start_date'])) {
            $data['start_date'] = $validated['start_date'];
        }
        if (array_key_exists('end_date', $validated)) {
            $data['end_date'] = $validated['end_date'];
        }
        if (isset($validated['repeat_interval'])) {
            $data['repeat_interval'] = $validated['repeat_interval'];
        }
        if (array_key_exists('custom_type', $validated)) {
            $data['custom_type'] = $validated['custom_type'];
        }
        if (array_key_exists('custom_days', $validated)) {
            $data['custom_days'] = $validated['custom_days'];
        }

        // update habit
        $habit->update($data);

        // success-message
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
