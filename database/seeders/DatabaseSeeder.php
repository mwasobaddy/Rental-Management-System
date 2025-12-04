<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        // Create test users with roles
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@rental.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('super-admin');

        $landlord = User::firstOrCreate(
            ['email' => 'landlord@rental.com'],
            [
                'name' => 'John Landlord',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $landlord->assignRole('landlord');

        $propertyManager = User::firstOrCreate(
            ['email' => 'manager@rental.com'],
            [
                'name' => 'Jane Manager',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $propertyManager->assignRole('property-manager');

        // Keep the original test user for backward compatibility
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $testUser->assignRole('landlord'); // Default role for test user
    }
}
