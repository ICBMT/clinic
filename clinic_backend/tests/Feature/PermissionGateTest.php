<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class PermissionGateTest extends TestCase
{
    use RefreshDatabase;

    /**
     * The dashboard gates used to call hasPermissionTo(), which throws
     * PermissionDoesNotExist — an HTTP 500 — when the permission row is
     * missing. Spatie's Gate::before (register_permission_check_method)
     * resolves abilities through checkPermissionTo() instead, so a missing
     * permission row must simply deny access with a 403.
     */
    public function test_missing_permission_row_denies_dashboard_with_403_not_500(): void
    {
        $user = User::factory()->create();

        Permission::where('name', 'dashboard.view')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->actingAs($user)
            ->get(route('dashboard.index'))
            ->assertStatus(403);
    }
}
