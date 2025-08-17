<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

/**
 * JournalController handles CRUD operations for user journals.
 * 
 * At the moment Journals is not used or displayed in the frontend as it is not part of the MVP.
 * In the future, it will be used to store daily journal entries for users.
 * Same as for habits, categories can be used to categorize journal entries.
 */

class JournalController extends Controller
{
    // READ ALL
    public function index(Request $request)
    {

        $user = Auth::user(); // get logged in user
        $query = Journal::where('user_id', $user->id); // query for filtering

        // filter by month & default to current month
        $monthInput = $request->input('month', Carbon::now()->format('Y-m'));

        try {
            $month = Carbon::parse($monthInput . '-01');
            $query->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid month format. Use YYYY-MM.'], 400);
        }

        // filter by title
        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->input('title') . '%');
        }

        // filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // sort by date (created_at)
        $allowedOrderBy = ['created_at'];
        $allowedOrderDir = ['asc', 'desc'];

        $orderBy = $request->input('order_by', 'created_at');
        $orderDir = $request->input('order_dir', 'desc'); // fallback to 'descending' if not provided

        if (!in_array($orderBy, $allowedOrderBy) || !in_array($orderDir, $allowedOrderDir)) {
            return response()->json(['message' => 'Invalid sort parameter'], 400); // 400 = Bad Request
        }

        $query->orderBy($orderBy, $orderDir);

        $journals = $query->get();

        return response()->json($journals);
    }

    // READ BY ID
    public function show($id)
    {
        $journal = Journal::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$journal) {
            return response()->json(['message' => 'Journal not found'], 404);
        }

        return response()->json($journal);
    }

    // CREATE
    public function create(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'entry' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $user = Auth::user(); // get logged in user
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // check if journal already exists for today
        $alreadyExists = Journal::where('user_id', $user->id)
        ->whereDate('created_at', now()->toDateString()) // if created_at is today -> a journal already exists
        ->exists();

        if ($alreadyExists) { // if a journal already exists for today -> message
            return response()->json([
                'message' => 'You have already created a journal for today.'
            ], 409); // 409 = Conflict
        }

        // create journal
        $journal = Journal::create([
            'title' => $validated['title'],
            'entry' => $validated['entry'],
            'category_id' => $validated['category_id'],
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Journal created successfully',
            'journal' => $journal
        ], 201);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $journal = Journal::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$journal) {
            return response()->json(['message' => 'Journal not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'entry' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
        ]);

        $journal->update($validated);
        return response()->json([
            'message' => 'Journal updated successfully',
            'journal' => $journal
        ]);
    }
    // DELETE
    public function delete($id)
    {
        $journal = Journal::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$journal) {
            return response()->json(['message' => 'Journal not found'], 404);
        }

        $journal->delete();
        return response()->json(['message' => 'Journal deleted successfully']);
    }
}
