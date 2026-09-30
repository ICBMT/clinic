<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed()
    {
        $user = $this->createUserWithProfileAccess();

        $response = $this
            ->actingAs($user)
            ->get(route('dashboard.profile.edit'));

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated()
    {
        $user = $this->createUserWithProfileAccess();

        $response = $this
            ->actingAs($user)
            ->patch(route('dashboard.profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('dashboard.profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = $this->createUserWithProfileAccess();

        $response = $this
            ->actingAs($user)
            ->patch(route('dashboard.profile.update'), [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('dashboard.profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $user = $this->createUserWithProfileAccess();

        $response = $this
            ->actingAs($user)
            ->delete(route('dashboard.profile.destroy'), [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('home'));

        $this->assertGuest();
        // User soft-deletes, so fresh() still returns the row; assert on deleted_at instead.
        $this->assertSoftDeleted($user);
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = $this->createUserWithProfileAccess();

        $response = $this
            ->actingAs($user)
            ->from(route('dashboard.profile.edit'))
            ->delete(route('dashboard.profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('dashboard.profile.edit'));

        $this->assertNotNull($user->fresh());
    }

    /**
     * Profile routes are permission-gated ('profile.edit' / 'profile.destroy');
     * a role-less factory user gets 403. Grant only what these tests exercise
     * (super-admin is not usable here: it may not delete its own account).
     */
    private function createUserWithProfileAccess(): User
    {
        $user = User::factory()->create();
        $user->givePermissionTo(['profile.edit', 'profile.destroy']);

        return $user;
    }
}
