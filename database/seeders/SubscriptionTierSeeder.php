<?php

namespace Database\Seeders;

use App\Models\SubscriptionTier;
use Illuminate\Database\Seeder;

class SubscriptionTierSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $tiers = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Perfect for small landlords just getting started',
                'price_monthly' => 29.99,
                'price_yearly' => 299.99, // 2 months free
                'max_properties' => 5,
                'max_units' => 25,
                'max_tenants' => 50,
                'features' => [
                    'Up to 5 properties',
                    'Up to 25 units',
                    'Up to 50 tenants',
                    'Basic property management',
                    'Tenant applications',
                    'Rent collection tracking',
                    'Basic maintenance requests',
                    'Email support',
                    '14-day free trial'
                ],
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'Ideal for growing rental businesses',
                'price_monthly' => 59.99,
                'price_yearly' => 599.99, // 2 months free
                'max_properties' => 25,
                'max_units' => 100,
                'max_tenants' => 250,
                'features' => [
                    'Up to 25 properties',
                    'Up to 100 units',
                    'Up to 250 tenants',
                    'Advanced property management',
                    'Online rent payments',
                    'Automated late fees',
                    'Maintenance workflow',
                    'Financial reporting',
                    'Custom branding',
                    'Priority email support',
                    'Property analytics',
                    '14-day free trial'
                ],
                'is_popular' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'For large property management companies',
                'price_monthly' => 129.99,
                'price_yearly' => 1299.99, // 2 months free
                'max_properties' => null, // Unlimited
                'max_units' => null, // Unlimited
                'max_tenants' => null, // Unlimited
                'features' => [
                    'Unlimited properties',
                    'Unlimited units',
                    'Unlimited tenants',
                    'All Professional features',
                    'Advanced analytics',
                    'API access',
                    'Multi-user accounts',
                    'Role-based permissions',
                    'White-label options',
                    'Dedicated account manager',
                    'Phone support',
                    'Custom integrations',
                    '30-day free trial'
                ],
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Free Trial',
                'slug' => 'trial',
                'description' => 'Try our platform risk-free',
                'price_monthly' => 0.00,
                'price_yearly' => 0.00,
                'max_properties' => 1,
                'max_units' => 5,
                'max_tenants' => 10,
                'features' => [
                    '1 property',
                    '5 units maximum',
                    '10 tenants maximum',
                    'Basic features only',
                    '14-day trial period',
                    'Email support'
                ],
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 0,
            ],
        ];

        foreach ($tiers as $tier) {
            SubscriptionTier::firstOrCreate(
                ['slug' => $tier['slug']],
                $tier
            );
        }

        $this->command->info('Subscription tiers created successfully!');
        $this->command->info('Created tiers: Trial, Starter ($29.99), Professional ($59.99), Enterprise ($129.99)');
    }
}
