<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Log the user in
        Auth::login($user);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful',
            'user' => Auth::user(),
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Get the avatar URL from Google - try multiple methods to ensure we get it
            $avatar = null;
            
            // Method 1: Try avatar property directly
            if (!empty($googleUser->avatar)) {
                $avatar = $googleUser->avatar;
            }
            // Method 2: Try getAvatar method
            elseif (method_exists($googleUser, 'getAvatar')) {
                $avatar = $googleUser->getAvatar();
            }
            
            // Log for debugging
            Log::info('Google User Data', [
                'id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'avatar' => $avatar,
            ]);

            // Find or create user by google_id first (most reliable)
            $user = User::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                // Try to find by email
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    // User exists with same email, just link Google account
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $avatar,
                    ]);
                } else {
                    // Create new user
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $avatar,
                        'password' => Hash::make(Str::random(24)),
                    ]);
                }
            } else {
                // User exists with google_id, just update avatar in case it changed
                $user->update([
                    'avatar' => $avatar,
                ]);
            }

            Auth::login($user);
            request()->session()->regenerate();

            // Redirect to home page
            return redirect('/home')->with('success', 'Successfully logged in with Google!');

        } catch (\Exception $e) {
            Log::error('Google OAuth Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect('/explore')->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
