<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     * @param  string|null  $permission
     */
    public function handle(Request $request, Closure $next, string $role, string $permission = null): Response
    {
        if (!auth()->check()) {
            return redirect('login');
        }

        $user = auth()->user();

        // Check role
        if (!$user->hasRole($role)) {
            abort(403, 'Access denied. Required role: ' . $role);
        }

        // Check permission if provided
        if ($permission && !$user->can($permission)) {
            abort(403, 'Access denied. Required permission: ' . $permission);
        }

        return $next($request);
    }
}
