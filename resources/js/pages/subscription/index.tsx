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
                        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <h3 className="text-lg font-semibold text-orange-900">
                                            Current Plan: {currentSubscription.tier_name}
                                        </h3>
                                    </div>
                                    <p className="text-orange-700 font-medium">
                                        {currentSubscription.is_on_trial && (
                                            <>🎯 Trial expires on {currentSubscription.trial_ends_at}</>
                                        )}
                                        {currentSubscription.is_active && !currentSubscription.is_on_trial && (
                                            <>🔄 Renews on {currentSubscription.current_period_ends_at}</>
                                        )}
                                    </p>
                                    {currentSubscription.days_until_expiry <= 7 && currentSubscription.days_until_expiry > 0 && (
                                        <div className="flex items-center space-x-2 mt-2 p-2 bg-amber-100 rounded-lg border border-amber-300">
                                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-amber-800 font-medium">
                                                Expires in {currentSubscription.days_until_expiry} days
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-orange-700 space-y-1">
                                        {currentSubscription.remaining_properties !== null && (
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L10 4.414l8.293 8.293a1 1 0 001.414-1.414l-9-9z" />
                                                    <path d="M17 18a1 1 0 01-1 1H4a1 1 0 01-1-1v-8a1 1 0 011-1h1a1 1 0 010 2H6v6h8v-6h1a1 1 0 110-2h1a1 1 0 011 1v8z" />
                                                </svg>
                                                <p>{currentSubscription.remaining_properties} properties remaining</p>
                                            </div>
                                        )}
                                        {currentSubscription.remaining_units !== null && (
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                                <p>{currentSubscription.remaining_units} units remaining</p>
                                            </div>
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

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Choose Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Perfect Plan</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Scale your rental business with flexible pricing designed to grow with you
                        </p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {tiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 flex flex-col ${
                                    tier.is_popular
                                        ? 'border-orange-300 shadow-orange-100 bg-gradient-to-b from-orange-50 to-white'
                                        : 'border-gray-200 bg-white'
                                } p-8`}
                            >
                                {tier.is_popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg">
                                            ⭐ Most Popular
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

                                <div className="mt-6 flex-1">
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

                                <div className="mt-8">
                                    {tier.slug === 'trial' ? (
                                        <Button
                                            onClick={handleStartTrial}
                                            disabled={processing || userStatus === 'trial'}
                                            className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                                                userStatus === 'trial' 
                                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg transform hover:scale-105'
                                            }`}
                                            variant={userStatus === 'trial' ? 'secondary' : 'default'}
                                        >
                                            {userStatus === 'trial' ? '✓ Current Plan' : '🚀 Start Free Trial'}
                                        </Button>
                                    ) : (
                                        <Link
                                            href={route('subscription.select', tier.slug)}
                                            className="block"
                                        >
                                            <Button
                                                className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                                                    currentSubscription?.tier_slug === tier.slug
                                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                        : tier.is_popular
                                                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg transform hover:scale-105'
                                                        : 'border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
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
                                                    ? '✓ Current Plan'
                                                    : '🎯 Choose Plan'}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features Comparison */}
                    <div className="mt-16 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Compare Plans</span>
                        </h2>
                        <p className="text-gray-600 mb-8">Detailed breakdown of what's included in each plan</p>
                        <div className="overflow-auto rounded-2xl shadow-xl border border-orange-100">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 tracking-wide">
                                            Feature
                                        </th>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <th
                                                key={tier.id}
                                                className={`px-6 py-4 text-center text-sm font-semibold tracking-wide ${
                                                    tier.is_popular ? 'text-orange-900 bg-orange-100' : 'text-orange-800'
                                                }`}
                                            >
                                                {tier.name}
                                                {tier.is_popular && (
                                                    <div className="text-xs text-orange-600 mt-1">⭐ Popular</div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-orange-100">
                                    <tr className="hover:bg-orange-25 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            🏠 Properties
                                        </td>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <td key={tier.id} className={`px-6 py-5 whitespace-nowrap text-sm font-medium text-center ${
                                                tier.is_popular ? 'text-orange-700 bg-orange-50' : 'text-gray-600'
                                            }`}>
                                                {formatLimit(tier.max_properties, 'property')}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-orange-25 transition-colors bg-orange-25/30">
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            🏢 Units
                                        </td>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <td key={tier.id} className={`px-6 py-5 whitespace-nowrap text-sm font-medium text-center ${
                                                tier.is_popular ? 'text-orange-700 bg-orange-50' : 'text-gray-600'
                                            }`}>
                                                {formatLimit(tier.max_units, 'unit')}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-orange-25 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            👥 Tenants
                                        </td>
                                        {tiers.filter(t => t.slug !== 'trial').map((tier) => (
                                            <td key={tier.id} className={`px-6 py-5 whitespace-nowrap text-sm font-medium text-center ${
                                                tier.is_popular ? 'text-orange-700 bg-orange-50' : 'text-gray-600'
                                            }`}>
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
