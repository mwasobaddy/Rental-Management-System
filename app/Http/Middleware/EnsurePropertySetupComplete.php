<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePropertySetupComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->hasCompletedPropertySetup()) {
            // Skip middleware for property setup routes
            if ($request->routeIs('profile.property.*')) {
                return $next($request);
            }

            // Redirect to property setup if not completed
            return redirect()->route('profile.property.setup')
                ->with('info', 'Please add your first property to continue.');
        }

        return $next($request);
    }
}