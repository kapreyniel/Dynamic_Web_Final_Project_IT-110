<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Display a listing of favorites
     */
    public function index(Request $request)
    {
        // Use user_id for authenticated users, session_id for guests
        if (auth()->check()) {
            $favorites = Favorite::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $sessionId = $request->session()->getId();
            $favorites = Favorite::where('session_id', $sessionId)
                ->whereNull('user_id')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($favorites);
    }

    /**
     * Store a newly created favorite
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_type' => 'required|string|max:50',
            'item_id' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'metadata' => 'nullable|json',
        ]);

        // Use user_id for authenticated users, session_id for guests
        $userId = auth()->check() ? auth()->id() : null;
        $sessionId = $request->session()->getId();

        // Check if already favorited
        $query = Favorite::where('item_type', $validated['item_type'])
            ->where('item_id', $validated['item_id']);
        
        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', $sessionId)->whereNull('user_id');
        }
        
        $existing = $query->first();

        if ($existing) {
            return response()->json([
                'message' => 'Already in favorites',
                'favorite' => $existing
            ], 200);
        }

        $favorite = Favorite::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'item_type' => $validated['item_type'],
            'item_id' => $validated['item_id'],
            'title' => $validated['title'],
            'image_url' => $validated['image_url'] ?? null,
            'description' => $validated['description'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
        ]);

        return response()->json([
            'message' => 'Added to favorites',
            'favorite' => $favorite
        ], 201);
    }

    /**
     * Remove the specified favorite
     */
    public function destroy(Request $request, $id)
    {
        // Use user_id for authenticated users, session_id for guests
        if (auth()->check()) {
            $favorite = Favorite::where('user_id', auth()->id())
                ->where('id', $id)
                ->first();
        } else {
            $sessionId = $request->session()->getId();
            $favorite = Favorite::where('session_id', $sessionId)
                ->whereNull('user_id')
                ->where('id', $id)
                ->first();
        }

        if (!$favorite) {
            return response()->json(['message' => 'Favorite not found'], 404);
        }

        $favorite->delete();

        return response()->json(['message' => 'Removed from favorites'], 200);
    }
}
