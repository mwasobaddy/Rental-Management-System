<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->hasCompletedProfile()) {
            // Allow access to profile setup routes
            if ($request->routeIs('profile.*') || 
                $request->routeIs('logout') || 
                $request->routeIs('google.*')) {
                return $next($request);
            }

            return redirect()->route('profile.setup')
                ->with('message', 'Please complete your profile setup to continue.');
        }

        return $next($request);
    }
}