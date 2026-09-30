<?php

namespace Tests;

use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Seed roles and permissions together with the schema for every test
     * class that uses RefreshDatabase (runs once per process, before the
     * per-test transaction).
     *
     * The dashboard gates in AuthServiceProvider call hasPermissionTo(), which
     * throws PermissionDoesNotExist (an HTTP 500) when the permission rows do
     * not exist at all, instead of simply denying access. Seeding them makes
     * the app behave as it does on a deployed database: unauthorised users get
     * a 403, authorised ones get through.
     */
    protected $seeder = PermissionSeeder::class;
}
