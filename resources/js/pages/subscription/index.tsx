import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

// Simple route helper for subscription routes
const route = (routeName: string, params?: any) => {
    const routes: Record<string, string> = {
        'subscription.index': '/subscription',
        'subscription.select': '/subscription/select',
        'subscription.subscribe': '/subscription/subscribe',
        'subscription.trial': '/subscription/trial',
        'subscription.cancel': '/subscription/cancel'
    };
    
    let url = routes[routeName] || routeName;
    
    // Handle route parameters (simple implementation)
    if (params && typeof params === 'string') {
        url = url + '/' + params;
    }
    
    return url;
};

interface SubscriptionTier {
    id: number;
    name: string;
    slug: string;
    description: string;
    price_monthly: string;
    price_yearly: string | null;
    yearly_savings: string | null;
    max_properties: number | null;
    max_units: number | null;
    max_tenants: number | null;
    features: string[];
    is_popular: boolean;
    has_unlimited_properties: boolean;
    has_unlimited_units: boolean;
    has_unlimited_tenants: boolean;
}

interface CurrentSubscription {
    id: number;
    tier_name: string;
    tier_slug: string;
    status: string;
    billing_cycle: string;
    is_active: boolean;
    is_on_trial: boolean;
    is_expired: boolean;
    days_until_expiry: number;
    remaining_properties: number | null;
    remaining_units: number | null;
    remaining_tenants: number | null;
    trial_ends_at: string | null;
    current_period_ends_at: string | null;
}

interface SubscriptionIndexProps {
    tiers: SubscriptionTier[];
    currentSubscription: CurrentSubscription | null;
    userStatus: string;
    requiresSubscription: boolean;
}

export default function SubscriptionIndex({
    tiers,
    currentSubscription,
    userStatus,
    requiresSubscription,
}: SubscriptionIndexProps) {
    const { post, processing } = useForm();

    const handleStartTrial = () => {
        post(route('subscription.trial'));
    };

    const formatLimit = (value: number | null, type: string): string => {
        if (value === null) return `Unlimited ${type}`;
        return `${value} ${type}${value !== 1 ? 's' : ''}`;
    };

    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Choose Your Plan',
            href: '#',
        },
    ];

    return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Choose Your Plan" />
                <div className="max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                    {/* Current Subscription Status */}
                    {currentSubscription && (
                        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-blue-900">
                                        Current Plan: {currentSubscription.tier_name}
                                    </h3>
                                    <p className="text-blue-700">
                                        {currentSubscription.is_on_trial && (
                                            <>Trial expires on {currentSubscription.trial_ends_at}</>
                                        )}
                                        {currentSubscription.is_active && !currentSubscription.is_on_trial && (
                                            <>Renews on {currentSubscription.current_period_ends_at}</>
                                        )}
                                    </p>
                                    {currentSubscription.days_until_expiry <= 7 && currentSubscription.days_until_expiry > 0 && (
                                        <p className="text-amber-600 font-medium">
                                            ⚠️ Expires in {currentSubscription.days_until_expiry} days
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-blue-700">
                                        {currentSubscription.remaining_properties !== null && (
                                            <p>{currentSubscription.remaining_properties} properties remaining</p>
                                        )}
                                        {currentSubscription.remaining_units !== null && (
                                            <p>{currentSubscription.remaining_units} units remaining</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Subscription Warning */}
                    {requiresSubscription && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <SparklesIcon className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Subscription Required
                                    </h3>
                                    <p className="mt-1 text-sm text-red-700">
                                        You need an active subscription to access your dashboard and manage your properties.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {tiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative rounded-lg shadow-sm border-2 ${
                                    tier.is_popular
                                        ? 'border-blue-500 shadow-blue-100'
                                        : 'border-gray-200'
                                } bg-white p-6`}
                            >
                                {tier.is_popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {tier.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {tier.description}
                                    </p>
                                    
                                    <div className="mt-4">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {tier.price_monthly}
                                        </span>
                                        {tier.slug !== 'trial' && (
                                            <span className="text-gray-500">/month</span>
                                        )}
                                    </div>

                                    {tier.yearly_savings && (
                                        <p className="mt-1 text-sm text-green-600">
                                            {tier.yearly_savings}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <ul className="space-y-3">
                                        {tier.features.slice(0, 6).map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    {tier.slug === 'trial' ? (
                                        <Button
                                            onClick={handleStartTrial}
                                            disabled={processing || userStatus === 'trial'}
                                            className="w-full"
                                            variant={userStatus === 'trial' ? 'secondary' : 'default'}
                                        >
                                            {userStatus === 'trial' ? 'Current Plan' : 'Start Free Trial'}
                                        </Button>
                                    ) : (
                                        <Link
                                            href={route('subscription.select', tier.slug)}
                                            className="block"
                                        >
                                            <Button
                                                className={`w-full ${
                                                    tier.is_popular
                                                        ? 'bg-blue-600 hover:bg-blue-700'
                                                        : ''
                                                }`}
                                                variant={
                                                    currentSubscription?.tier_slug === tier.slug
                                                        ? 'secondary'
                                                        : tier.is_popular
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {currentSubscription?.tier_slug === tier.slug
                                                    ? 'Current Plan'
                                                    : 'Choose Plan'}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features Comparison */}
                    <div className="mt-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Compare Plans
                        </h2>
                        <div className="mt-6 overflow-auto rounded-lg shadow border">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Feature
                                        </th>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <th
                                                key={tier.id}
                                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {tier.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Properties
                                        </td>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {formatLimit(tier.max_properties, 'property')}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Units
                                        </td>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {formatLimit(tier.max_units, 'unit')}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Tenants
                                        </td>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {formatLimit(tier.max_tenants, 'tenant')}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </ AppLayout>
    );
}
