<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect to Google for authentication.
     */
    public function redirectToGoogle(Request $request)
    {
        // Store linking flag in session if this is for linking accounts
        if ($request->get('link')) {
            session(['linking_google_account' => true]);
        }
        
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google callback and authenticate user.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $isLinking = session('linking_google_account', false);
            
            if ($isLinking) {
                // User is trying to link their Google account
                session()->forget('linking_google_account');
                
                $currentUser = Auth::user();
                if (!$currentUser) {
                    return redirect()->route('login')->withErrors(['error' => 'Please log in first.']);
                }
                
                // Check if this Google account is already linked to another user
                $existingGoogleUser = User::where('google_id', $googleUser->id)->first();
                if ($existingGoogleUser && $existingGoogleUser->id !== $currentUser->id) {
                    return redirect()->route('profile.setup')
                        ->withErrors(['google' => 'This Google account is already linked to another user.']);
                }
                
                // Link the Google account
                $currentUser->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'has_google_linked' => true,
                ]);
                
                return redirect()->route('profile.setup')
                    ->with('success', 'Google account linked successfully!');
            }
            
            // Regular login/registration flow
            // Check if user already exists with this Google ID
            $user = User::where('google_id', $googleUser->id)->first();
            
            if ($user) {
                // Update existing user's info
                $user->update([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar,
                ]);
            } else {
                // Check if user exists with this email (without Google ID)
                $existingUser = User::where('email', $googleUser->email)->first();
                
                if ($existingUser) {
                    // Link existing account to Google
                    $existingUser->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'has_google_linked' => true,
                    ]);
                    $user = $existingUser;
                } else {
                    // Create new user - split name into first and last
                    $nameParts = explode(' ', $googleUser->name, 2);
                    $firstName = $nameParts[0] ?? '';
                    $lastName = $nameParts[1] ?? '';
                    
                    $user = User::create([
                        'name' => $googleUser->name,
                        'first_name' => $firstName,
                        'last_name' => $lastName,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'password' => Hash::make(Str::random(24)), // Random password for security
                        'email_verified_at' => now(), // Google emails are pre-verified
                        'has_google_linked' => true,
                    ]);
                    
                    // Assign default role to new users
                    $user->assignRole('landlord'); // Default role for new Google sign-ups
                }
            }
            
            // Log the user in
            Auth::login($user, true);
            
            // Check if user needs subscription
            if ($user->requiresSubscription()) {
                return redirect()->route('subscription.index')
                    ->with('message', 'Welcome! Please select a subscription plan to get started.');
            }
            
            // Check if user needs profile setup
            if (!$user->hasCompletedProfile()) {
                return redirect()->route('profile.setup')
                    ->with('message', 'Please complete your profile setup to get started.');
            }
            
            return redirect()->intended('/dashboard');
            
        } catch (\Exception $e) {
            \Log::error('Google authentication error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')->withErrors([
                'email' => 'Unable to login with Google. Please try again. Error: ' . $e->getMessage(),
            ]);
        }
    }
}