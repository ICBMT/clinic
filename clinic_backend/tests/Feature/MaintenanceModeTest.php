<?php

namespace Tests\Feature;

use App\Models\MaintenanceMode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaintenanceModeTest extends TestCase
{
    use RefreshDatabase;

    private function enableMaintenance(array $attributes = []): MaintenanceMode
    {
        return MaintenanceMode::create(array_merge([
            'title_en' => 'Scheduled maintenance',
            'title_ar' => 'صيانة مجدولة',
            'description_en' => 'We will be right back.',
            'description_ar' => 'سنعود قريباً.',
            'target_roles' => [],
            'is_enabled' => true,
            'enabled_at' => now(),
        ], $attributes));
    }

    public function test_public_pages_are_accessible_when_maintenance_is_not_enabled(): void
    {
        $this->get('/')->assertOk();
    }

    public function test_guests_get_the_maintenance_page_when_enabled(): void
    {
        $this->enableMaintenance();

        $this->get('/')->assertStatus(503);
        $this->get('/terms')->assertStatus(503);
        $this->get('/privacy')->assertStatus(503);
    }

    public function test_authentication_stays_available_during_maintenance(): void
    {
        $this->enableMaintenance();

        $this->get('/login')->assertOk();
        $this->get('/maintenance')->assertOk();
    }

    public function test_authenticated_users_bypass_when_target_roles_is_empty(): void
    {
        $this->enableMaintenance(['target_roles' => []]);

        $this->actingAs(User::factory()->create())
            ->get('/')
            ->assertOk();
    }

    public function test_only_allowed_roles_bypass_when_target_roles_is_set(): void
    {
        $this->enableMaintenance(['target_roles' => ['super-admin']]);

        $regularUser = User::factory()->create();
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('super-admin');

        $this->actingAs($regularUser)->get('/')->assertStatus(503);
        $this->actingAs($superAdmin)->get('/')->assertOk();
    }
}
