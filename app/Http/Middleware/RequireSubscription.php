<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        // Allow non-authenticated users to pass through
        if (!$user) {
            return $next($request);
        }

        // Super admins always have access
        if ($user->hasRole('super-admin')) {
            return $next($request);
        }

        // Non-landlord roles have access (property managers, assistants, etc.)
        if (!$user->hasRole('landlord')) {
            return $next($request);
        }

        // Check if landlord has active subscription or trial
        if (!$user->canAccessDashboard()) {
            // Allow access to subscription routes
            if ($request->routeIs('subscription.*')) {
                return $next($request);
            }

            // Redirect to subscription selection page
            return redirect()->route('subscription.index')
                ->with('warning', 'Please select a subscription plan to access your dashboard.');
        }

        // Check if subscription is about to expire (within 7 days)
        $subscription = $user->activeSubscription;
        if ($subscription && $subscription->getDaysUntilExpiry() <= 7 && $subscription->getDaysUntilExpiry() > 0) {
            session()->flash('subscription_warning', 
                'Your subscription expires in ' . $subscription->getDaysUntilExpiry() . ' days. Please renew to avoid service interruption.'
            );
        }

        return $next($request);
    }
}
