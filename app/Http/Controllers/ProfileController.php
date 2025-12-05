<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the profile setup form
     */
    public function setup(): Response
    {
        $user = auth()->user();
        
        return Inertia::render('profile/setup', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'is_google_user' => $user->isGoogleUser(),
                'has_password' => !$user->needsPasswordSetup(),
                'has_google_linked' => $user->has_google_linked ?? false,
                'properties_count' => $user->properties()->count(),
            ],
            'property_types' => [
                'single_family' => 'Single Family Home',
                'multi_family' => 'Multi-Family Home',
                'apartment' => 'Apartment Building',
                'condo' => 'Condominium',
                'townhouse' => 'Townhouse',
                'commercial' => 'Commercial Property',
                'mixed_use' => 'Mixed Use',
                'other' => 'Other',
            ]
        ]);
    }

    /**
     * Complete the profile setup
     */
    public function complete(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            // User profile fields
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => $user->needsPasswordSetup() ? ['required', 'confirmed', Rules\Password::defaults()] : 'nullable|confirmed|' . Rules\Password::defaults(),
            
            // Property fields
            'property_name' => 'required|string|max:255',
            'property_type' => 'required|string|in:single_family,multi_family,apartment,condo,townhouse,commercial,mixed_use,other',
            'property_address' => 'required|string|max:500',
            'property_city' => 'required|string|max:255',
            'property_state' => 'required|string|max:255',
            'property_postal_code' => 'required|string|max:20',
            'property_country' => 'string|max:255',
            'total_units' => 'required|integer|min:1|max:1000',
            'purchase_price' => 'nullable|numeric|min:0',
            'monthly_rent' => 'nullable|numeric|min:0',
            'purchase_date' => 'nullable|date|before_or_equal:today',
            'description' => 'nullable|string|max:1000',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:255',
        ]);

        // Update user profile
        $userUpdateData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'profile_completed_at' => now(),
        ];

        if ($request->filled('password') && $user->needsPasswordSetup()) {
            $userUpdateData['password'] = Hash::make($request->password);
        }

        $user->update($userUpdateData);

        // Create the property
        $property = Property::create([
            'user_id' => $user->id,
            'name' => $request->property_name,
            'type' => $request->property_type,
            'description' => $request->description,
            'address' => $request->property_address,
            'city' => $request->property_city,
            'state' => $request->property_state,
            'postal_code' => $request->property_postal_code,
            'country' => $request->property_country ?? 'US',
            'total_units' => $request->total_units,
            'purchase_price' => $request->purchase_price,
            'monthly_rent' => $request->monthly_rent,
            'purchase_date' => $request->purchase_date,
            'amenities' => $request->amenities ?? [],
            'status' => 'active',
        ]);

        return redirect()->route('dashboard')->with('success', 'Profile setup completed successfully! Welcome to your rental management dashboard.');
    }

    /**
     * Link Google account
     */
    public function linkGoogle()
    {
        return redirect()->route('google.redirect', ['link' => true]);
    }

    /**
     * Check password strength
     */
    public function checkPasswordStrength(Request $request)
    {
        $password = $request->input('password', '');
        
        $strength = [
            'score' => 0,
            'level' => 'weak',
            'feedback' => [],
        ];

        if (strlen($password) < 8) {
            $strength['feedback'][] = 'Password should be at least 8 characters long';
        } else {
            $strength['score'] += 1;
        }

        if (!preg_match('/[a-z]/', $password)) {
            $strength['feedback'][] = 'Add lowercase letters';
        } else {
            $strength['score'] += 1;
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $strength['feedback'][] = 'Add uppercase letters';
        } else {
            $strength['score'] += 1;
        }

        if (!preg_match('/[0-9]/', $password)) {
            $strength['feedback'][] = 'Add numbers';
        } else {
            $strength['score'] += 1;
        }

        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $strength['feedback'][] = 'Add special characters';
        } else {
            $strength['score'] += 1;
        }

        // Determine strength level
        if ($strength['score'] >= 5) {
            $strength['level'] = 'strong';
        } elseif ($strength['score'] >= 3) {
            $strength['level'] = 'medium';
        } else {
            $strength['level'] = 'weak';
        }

        return response()->json($strength);
    }
}