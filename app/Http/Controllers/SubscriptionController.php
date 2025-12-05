<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionTier;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $tiers = SubscriptionTier::getActiveOrderedTiers();
        $currentSubscription = $user->activeSubscription;

        return Inertia::render('subscription/index', [
            'tiers' => $tiers->map(function ($tier) {
                return [
                    'id' => $tier->id,
                    'name' => $tier->name,
                    'slug' => $tier->slug,
                    'description' => $tier->description,
                    'price_monthly' => $tier->formatted_price_monthly,
                    'price_yearly' => $tier->formatted_price_yearly,
                    'yearly_savings' => $tier->yearly_savings,
                    'max_properties' => $tier->max_properties,
                    'max_units' => $tier->max_units,
                    'max_tenants' => $tier->max_tenants,
                    'features' => $tier->features,
                    'is_popular' => $tier->is_popular,
                    'has_unlimited_properties' => $tier->hasUnlimitedProperties(),
                    'has_unlimited_units' => $tier->hasUnlimitedUnits(),
                    'has_unlimited_tenants' => $tier->hasUnlimitedTenants(),
                ];
            }),
            'currentSubscription' => $currentSubscription ? [
                'id' => $currentSubscription->id,
                'tier_name' => $currentSubscription->subscriptionTier->name,
                'tier_slug' => $currentSubscription->subscriptionTier->slug,
                'status' => $currentSubscription->status,
                'billing_cycle' => $currentSubscription->billing_cycle,
                'is_active' => $currentSubscription->isActive(),
                'is_on_trial' => $currentSubscription->isOnTrial(),
                'is_expired' => $currentSubscription->isExpired(),
                'days_until_expiry' => $currentSubscription->getDaysUntilExpiry(),
                'remaining_properties' => $currentSubscription->getRemainingProperties(),
                'remaining_units' => $currentSubscription->getRemainingUnits(),
                'remaining_tenants' => $currentSubscription->getRemainingTenants(),
                'trial_ends_at' => $currentSubscription->trial_ends_at?->format('M j, Y'),
                'current_period_ends_at' => $currentSubscription->current_period_ends_at?->format('M j, Y'),
            ] : null,
            'userStatus' => $user->getSubscriptionStatus(),
            'requiresSubscription' => $user->requiresSubscription(),
        ]);
    }

    public function select(Request $request, string $tierSlug): Response
    {
        $tier = SubscriptionTier::findBySlug($tierSlug);
        
        if (!$tier) {
            abort(404, 'Subscription tier not found');
        }

        $billingCycle = $request->get('billing', 'monthly');

        return Inertia::render('subscription/checkout', [
            'tier' => [
                'id' => $tier->id,
                'name' => $tier->name,
                'slug' => $tier->slug,
                'description' => $tier->description,
                'price_monthly' => $tier->price_monthly,
                'price_yearly' => $tier->price_yearly,
                'formatted_price_monthly' => $tier->formatted_price_monthly,
                'formatted_price_yearly' => $tier->formatted_price_yearly,
                'yearly_savings' => $tier->yearly_savings,
                'features' => $tier->features,
                'max_properties' => $tier->max_properties,
                'max_units' => $tier->max_units,
                'max_tenants' => $tier->max_tenants,
            ],
            'billingCycle' => $billingCycle,
            'selectedPrice' => $billingCycle === 'yearly' ? $tier->price_yearly : $tier->price_monthly,
            'formattedPrice' => $billingCycle === 'yearly' ? $tier->formatted_price_yearly : $tier->formatted_price_monthly,
        ]);
    }

    public function subscribe(Request $request): \Illuminate\Http\RedirectResponse
    {
        // Debug: Log the incoming request data
        \Log::info('Subscription request received', [
            'user_id' => auth()->id(),
            'request_data' => $request->all()
        ]);

        $request->validate([
            'tier_id' => 'required|exists:subscription_tiers,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'payment_method' => 'required|string',
            'cardholder_name' => 'required|string|max:255',
            'card_number' => 'required|string',
            'expiry_month' => 'required|string|size:2',
            'expiry_year' => 'required|string|size:2',
            'cvv' => 'required|string|min:3|max:4',
        ]);

        $user = auth()->user();
        $tier = SubscriptionTier::findOrFail($request->tier_id);

        // Cancel existing subscription if any
        $existingSubscription = $user->activeSubscription;
        if ($existingSubscription) {
            $existingSubscription->cancel();
        }

        // For demo purposes, we'll simulate payment success
        // In production, integrate with Stripe, PayPal, etc.
        $isPaymentSuccessful = $this->processPayment($request, $tier);

        if ($isPaymentSuccessful) {
            // Create new subscription
            $subscription = UserSubscription::create([
                'user_id' => $user->id,
                'subscription_tier_id' => $tier->id,
                'status' => $tier->slug === 'trial' ? 'trial' : 'active',
                'billing_cycle' => $request->billing_cycle,
                'amount_paid' => $request->billing_cycle === 'yearly' ? $tier->price_yearly : $tier->price_monthly,
                'trial_ends_at' => $tier->slug === 'trial' ? now()->addDays(14) : null,
                'current_period_starts_at' => $tier->slug !== 'trial' ? now() : null,
                'current_period_ends_at' => $tier->slug !== 'trial' ? 
                    ($request->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth()) : null,
                'payment_method' => $request->payment_method,
                'payment_id' => 'demo_' . uniqid(), // In production, use actual payment ID
            ]);

            // Debug: Log successful subscription creation
            \Log::info('Subscription created successfully', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'tier_name' => $tier->name,
                'billing_cycle' => $request->billing_cycle,
                'status' => $subscription->status
            ]);

            // Check if user needs profile setup
            if (!$user->hasCompletedProfile()) {
                return redirect()->route('profile.setup')->with('success', 'Subscription activated! Please complete your profile setup to get started.');
            }
            
            return redirect()->route('dashboard')->with('success', 'Subscription activated successfully!');
        }

        // Debug: Log payment failure
        \Log::warning('Payment failed for subscription', [
            'user_id' => $user->id,
            'tier_id' => $tier->id,
            'payment_method' => $request->payment_method
        ]);

        return back()->withErrors(['payment' => 'Payment failed. Please try again.']);
    }

    public function startTrial(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = auth()->user();

        // Check if user already had a trial
        $hasHadTrial = $user->subscriptions()
            ->where('status', 'trial')
            ->exists();

        if ($hasHadTrial) {
            return back()->withErrors(['trial' => 'You have already used your free trial.']);
        }

        $trialTier = SubscriptionTier::findBySlug('starter'); // Give them starter features for trial

        if (!$trialTier) {
            return back()->withErrors(['trial' => 'Trial tier not available.']);
        }

        UserSubscription::createTrial($user->id, $trialTier->id, 14);

        return redirect()->route('dashboard')->with('success', 'Your 14-day free trial has started!');
    }

    public function cancel(): \Illuminate\Http\RedirectResponse
    {
        $user = auth()->user();
        $subscription = $user->activeSubscription;

        if ($subscription) {
            $subscription->cancel();
            return back()->with('success', 'Subscription cancelled successfully.');
        }

        return back()->withErrors(['subscription' => 'No active subscription found.']);
    }

    /**
     * Simulate payment processing
     * In production, integrate with actual payment providers
     */
    private function processPayment(Request $request, SubscriptionTier $tier): bool
    {
        // Simulate payment processing delay
        sleep(1);

        // For demo, always return true
        // In production, implement actual payment logic
        return true;
    }
}
