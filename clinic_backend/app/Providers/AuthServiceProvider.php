<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Model policies can be added here if needed
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Super admin can access everything
        Gate::before(function ($user, $ability) {
            if ($user->hasRole('super-admin')) {
                return true;
            }
        });

        // Every other ability whose name matches a permission is resolved by
        // Spatie's own Gate::before (config/permission.php sets
        // register_permission_check_method = true), which uses
        // checkPermissionTo() and therefore denies — instead of throwing —
        // when a permission row is missing. Only gates that add behaviour on
        // top of the plain permission check are defined here.

        // ============================================
        // Platform permissions
        // ============================================

        // ============================================
        // User Management permissions
        // ============================================
        // Users Management

        Gate::define('users.toggle-status', function ($user) {
            // Clinic managers should not be able to toggle user status (including owner status)
            if ($user->hasRole('clinic_manager') && !$user->hasRole('super-admin')) {
                return false;
            }
            return $user->checkPermissionTo('users.toggle-status');
        });

        // Profile Management

        Gate::define('profile.destroy', function ($user) {
            // Super admin cannot delete their own account
            if ($user->hasRole('super-admin')) {
                return false;
            }
            return $user->checkPermissionTo('profile.destroy');
        });

        // Role Management

        // Admin Management

        // Activity Logs

        // ============================================
        // Clinic Management permissions
        // ============================================
        // Clinics Management

        Gate::define('clinics.toggle-featured', function ($user) {
            // Super admin can always toggle
            if ($user->hasRole('super-admin')) {
                return true;
            }
            // Clinic and clinic_manager can toggle for their own clinics (ownership checked in controller)
            return $user->checkPermissionTo('clinics.toggle-featured');
        });

        Gate::define('clinics.toggle-auto-confirm', function ($user) {
            // Super admin can always toggle
            if ($user->hasRole('super-admin')) {
                return true;
            }
            // Clinic and clinic_manager can toggle for their own clinics (ownership checked in controller)
            return $user->checkPermissionTo('clinics.toggle-auto-confirm');
        });

        Gate::define('clinics.toggle-owner-status', function ($user) {
            // Clinic and clinic_manager roles should not be able to toggle owner status
            if (($user->hasRole('clinic') || $user->hasRole('clinic_manager')) && !$user->hasRole('super-admin')) {
                return false;
            }
            return $user->checkPermissionTo('clinics.toggle-owner-status');
        });

        // Clinics Address Management

        // Clinics Operating Hours Management

        // Clinics Subscriptions Management

        // Bookings Management (unified)

        // Legacy bookings permissions (for backward compatibility)

        // Payouts Management (unified)

        // Legacy payouts permissions (for backward compatibility)

        // Earnings Management

        // Clinics Staff Management

        // Categories Management

        Gate::define('categories.create', function ($user) {
            // Allow clinic owners and managers to create categories
            if ($user->hasRole(['clinic', 'clinic_manager']) && $user->checkPermissionTo('categories.create')) {
                return true;
            }
            return $user->checkPermissionTo('categories.create');
        });

        // Treatments Management

        // Treatment Slots Management

        // Machines Management

        // Reviews Management

        // ============================================
        // Location Management permissions
        // ============================================
        // Governorates Management

        // Areas Management

        // ============================================
        // Promotion Management permissions
        // ============================================
        // Banners Management

        // ============================================
        // Support & Contact Management permissions
        // ============================================
        // FAQs Management

        // ============================================
        // Finance Management permissions
        // ============================================
        // Payment Methods Management

        // Subscription Packages Management

        // Clinic Subscriptions Management

        // ============================================
        // Notifications Management permissions
        // ============================================
        // Notifications Management
        Gate::define('notifications.view', function ($user) {
            // Allow clinic and clinic_manager roles to view their notifications
            if ($user->hasRole(['clinic', 'clinic_manager'])) {
                return true;
            }
            return $user->checkPermissionTo('notifications.view');
        });

        Gate::define('notifications.show', function ($user) {
            // Allow clinic and clinic_manager roles to view their notifications
            if ($user->hasRole(['clinic', 'clinic_manager'])) {
                return true;
            }
            return $user->checkPermissionTo('notifications.show');
        });

        Gate::define('notifications.destroy', function ($user) {
            // Allow clinic and clinic_manager roles to delete their own notifications
            if ($user->hasRole(['clinic', 'clinic_manager'])) {
                return true;
            }
            return $user->checkPermissionTo('notifications.destroy');
        });

        Gate::define('notifications.mark-read', function ($user) {
            // Allow clinic and clinic_manager roles to mark their notifications as read
            if ($user->hasRole(['clinic', 'clinic_manager'])) {
                return true;
            }
            return $user->checkPermissionTo('notifications.mark-read');
        });

        Gate::define('notifications.mark-all-read', function ($user) {
            // Allow clinic and clinic_manager roles to mark all their notifications as read
            if ($user->hasRole(['clinic', 'clinic_manager'])) {
                return true;
            }
            return $user->checkPermissionTo('notifications.mark-all-read');
        });

        // Broadcast Management

        // ============================================
        // Site Settings permissions
        // ============================================
        // Site Settings - General

        // Site Settings - Vendor

        // Site Settings - Contact

        // Site Settings - Terms

        // Site Settings - Privacy

        // Site Settings - Communication

        // Site Settings - MyFatoorah

        // Site Settings - Support

        // Site Settings - Booking

    }
}
