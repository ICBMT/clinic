<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        // The dashboard is permission-gated (Gate 'dashboard.view'); a role-less user gets 403.
        $user = User::factory()->create();
        $user->givePermissionTo('dashboard.view');

        $this->actingAs($user);

        $this->get(route('dashboard.index'))->assertOk();
    }
}
