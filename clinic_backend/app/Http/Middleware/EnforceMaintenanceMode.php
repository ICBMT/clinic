<?php

namespace App\Http\Middleware;

use App\Models\MaintenanceMode;
use Inertia\Inertia;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * Allow bypass for configured roles while maintenance is enabled.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $mode = MaintenanceMode::query()->latest('id')->first();
        } catch (\Throwable $e) {
            // Degrade gracefully (open) if the maintenance_modes table or the
            // MaintenanceMode model is unavailable, e.g. during tests or before
            // migrations have run. \Throwable is required because a missing class
            // raises \Error, which \Exception does not catch.
            return $next($request);
        }

        if ($mode && $mode->is_enabled) {
            // Allow authenticated users with allowed roles
            if (Auth::check()) {
                $user = Auth::user();
                $allowed = collect((array) ($mode->target_roles ?? []));
                if ($allowed->isEmpty() || $user->roles()->whereIn('name', $allowed)->exists()) {
                    return $next($request);
                }
            }

            // For API, return JSON 503; for web, show view
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => $mode->title_en,
                    'title' => $mode->title_en,
                    'details' => $mode->description_en,
                ], 503);
            }

            // Prop keys stay body_en/body_ar because resources/js/pages/maintenance.tsx
            // and resources/views/errors/maintenance.blade.php read those names; the
            // maintenance_modes table stores them as description_en/description_ar.
            $response = Inertia::render('maintenance', [
                'title_en' => $mode->title_en,
                'title_ar' => $mode->title_ar,
                'body_en' => $mode->description_en,
                'body_ar' => $mode->description_ar,
            ])->toResponse($request);

            return $response->setStatusCode(503);
        }

        return $next($request);
    }
}
