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
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google callback and authenticate user.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
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
                    ]);
                    $user = $existingUser;
                } else {
                    // Create new user
                    $user = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'password' => Hash::make(Str::random(24)), // Random password for security
                        'email_verified_at' => now(), // Google emails are pre-verified
                    ]);
                    
                    // Assign default role to new users
                    $user->assignRole('landlord'); // Default role for new Google sign-ups
                    
                    // Start with a trial subscription
                    $trialTier = \App\Models\SubscriptionTier::findBySlug('starter');
                    if ($trialTier) {
                        \App\Models\UserSubscription::createTrial($user->id, $trialTier->id, 14);
                    }
                }
            }
            
            // Log the user in
            Auth::login($user, true);
            
            return redirect()->intended('/dashboard');
            
        } catch (\Exception $e) {
            return redirect('/login')->withErrors([
                'email' => 'Unable to login with Google. Please try again.',
            ]);
        }
    }
}