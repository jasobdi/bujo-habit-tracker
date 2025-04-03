<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JournalController extends Controller
{
    // READ ALL
    public function index()
    {
        $journals = Journal::where('user_id', Auth::id())->get(); // get all journals from logged in ser
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

        $journal = Journal::create([
            'title' => $validated['title'],
            'entry' => $validated['entry'],
            'category_id' => $validated['category_id'] ?? null,
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
            'category_id' => 'nullable|exists:categories,id',
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
