<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for rental management system
        $permissions = [
            // Property Management
            'view properties',
            'create properties',
            'edit properties',
            'delete properties',
            'publish properties',
            'unpublish properties',
            
            // Unit Management
            'view units',
            'create units',
            'edit units',
            'delete units',
            'manage unit availability',
            
            // Tenant Management
            'view tenants',
            'create tenants',
            'edit tenants',
            'delete tenants',
            'approve applications',
            'reject applications',
            
            // Lease Management
            'view leases',
            'create leases',
            'edit leases',
            'terminate leases',
            'renew leases',
            
            // Financial Management
            'view financials',
            'manage payments',
            'generate reports',
            'export data',
            
            // Maintenance Management
            'view maintenance',
            'create maintenance',
            'assign maintenance',
            'complete maintenance',
            
            // Company Management
            'manage company settings',
            'manage company branding',
            'manage users',
            'manage roles',
            
            // Analytics & Reports
            'view analytics',
            'view detailed reports',
            'export reports',
            
            // System Administration
            'access admin panel',
            'manage system settings',
            'view system logs',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Super Admin - Full access to everything
        $superAdminRole = Role::create(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());

        // Landlord - Property owner with full control over their properties
        $landlordRole = Role::create(['name' => 'landlord']);
        $landlordRole->givePermissionTo([
            // Property Management
            'view properties',
            'create properties', 
            'edit properties',
            'delete properties',
            'publish properties',
            'unpublish properties',
            
            // Unit Management
            'view units',
            'create units',
            'edit units',
            'delete units',
            'manage unit availability',
            
            // Tenant Management
            'view tenants',
            'create tenants',
            'edit tenants',
            'approve applications',
            'reject applications',
            
            // Lease Management
            'view leases',
            'create leases',
            'edit leases',
            'terminate leases',
            'renew leases',
            
            // Financial Management
            'view financials',
            'manage payments',
            'generate reports',
            'export data',
            
            // Maintenance Management
            'view maintenance',
            'create maintenance',
            'assign maintenance',
            'complete maintenance',
            
            // Company Management
            'manage company settings',
            'manage company branding',
            
            // Analytics & Reports
            'view analytics',
            'view detailed reports',
            'export reports',
        ]);

        // Property Manager - Manages properties on behalf of landlords
        $propertyManagerRole = Role::create(['name' => 'property-manager']);
        $propertyManagerRole->givePermissionTo([
            // Property Management (limited)
            'view properties',
            'edit properties',
            'publish properties',
            'unpublish properties',
            
            // Unit Management
            'view units',
            'create units',
            'edit units',
            'manage unit availability',
            
            // Tenant Management
            'view tenants',
            'create tenants',
            'edit tenants',
            'approve applications',
            'reject applications',
            
            // Lease Management
            'view leases',
            'create leases',
            'edit leases',
            'renew leases',
            
            // Financial Management
            'view financials',
            'manage payments',
            'generate reports',
            
            // Maintenance Management
            'view maintenance',
            'create maintenance',
            'assign maintenance',
            'complete maintenance',
            
            // Analytics & Reports
            'view analytics',
            'view detailed reports',
        ]);

        // Assistant/Employee - Limited access for support staff
        $assistantRole = Role::create(['name' => 'assistant']);
        $assistantRole->givePermissionTo([
            // Property Management (view only)
            'view properties',
            
            // Unit Management (view only)
            'view units',
            
            // Tenant Management (limited)
            'view tenants',
            'edit tenants',
            
            // Lease Management (view only)
            'view leases',
            
            // Maintenance Management
            'view maintenance',
            'create maintenance',
            'complete maintenance',
        ]);

        // Tenant - Very limited access (for future use if tenants get portal access)
        $tenantRole = Role::create(['name' => 'tenant']);
        $tenantRole->givePermissionTo([
            // Can only view their own information and submit maintenance requests
            'view maintenance',
            'create maintenance',
        ]);

        // Viewer - Read-only access for investors or stakeholders
        $viewerRole = Role::create(['name' => 'viewer']);
        $viewerRole->givePermissionTo([
            'view properties',
            'view units',
            'view tenants',
            'view leases',
            'view financials',
            'view maintenance',
            'view analytics',
        ]);

        $this->command->info('Roles and permissions created successfully!');
        $this->command->info('Created roles: super-admin, landlord, property-manager, assistant, tenant, viewer');
    }
}
