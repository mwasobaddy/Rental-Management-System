import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { CheckIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface SubscriptionTier {
    id: number;
    name: string;
    slug: string;
    description: string;
    price_monthly: number;
    price_yearly: number | null;
    formatted_price_monthly: string;
    formatted_price_yearly: string | null;
    yearly_savings: string | null;
    features: string[];
    max_properties: number | null;
    max_units: number | null;
    max_tenants: number | null;
}

interface CheckoutProps {
    tier: SubscriptionTier;
    billingCycle: 'monthly' | 'yearly';
    selectedPrice: number;
    formattedPrice: string;
}

export default function Checkout({
    tier,
    billingCycle,
    selectedPrice,
    formattedPrice,
}: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm({
        tier_id: tier.id,
        billing_cycle: billingCycle,
        payment_method: 'demo',
        cardholder_name: '',
        card_number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
        payment: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Debug: Log everything before submission
        console.log('Form submission started');
        console.log('Form data:', data);
        console.log('Processing state:', processing);
        console.log('Current errors:', errors);
        
        // Use direct URL instead of route helper for now
        post('/subscription/subscribe', {
            onSuccess: (page) => {
                console.log('✅ Subscription successful!', page);
            },
            onError: (errors) => {
                console.error('❌ Subscription errors:', errors);
                // Force show the errors in an alert for debugging
                alert('Form errors: ' + JSON.stringify(errors, null, 2));
            },
            onFinish: () => {
                console.log('🔄 Subscription request finished');
            },
            onStart: () => {
                console.log('🚀 Request started');
            }
        });
    };
    
        
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Choose Your Plan',
            href: '/subscription',
        },
        {
            title: 'Complete Your Subscription',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Subscribe to ${tier.name}`} />

            <div className="max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Plan Summary */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="border rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {tier.name} Plan
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {tier.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formattedPrice}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {billingCycle === 'yearly' ? 'per year' : 'per month'}
                                    </p>
                                </div>
                            </div>

                            {tier.yearly_savings && billingCycle === 'yearly' && (
                                <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                                    <p className="text-sm text-green-800 font-medium">
                                        🎉 {tier.yearly_savings}
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Included Features:
                                </h4>
                                <ul className="space-y-1">
                                    {tier.features.slice(0, 5).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-900">
                                    Total Today:
                                </span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formattedPrice}
                                </span>
                            </div>
                            {billingCycle === 'yearly' && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Next billing: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </p>
                            )}
                            {billingCycle === 'monthly' && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Payment Information
                        </h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                                Use any test values in the form below.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="cardholder_name">Cardholder Name</Label>
                                <Input
                                    id="cardholder_name"
                                    type="text"
                                    value={data.cardholder_name}
                                    onChange={(e) => setData('cardholder_name', e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="mt-1"
                                />
                                {errors.cardholder_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cardholder_name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="card_number">Card Number</Label>
                                <Input
                                    id="card_number"
                                    type="text"
                                    value={data.card_number}
                                    onChange={(e) => setData('card_number', e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                    className="mt-1"
                                />
                                {errors.card_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.card_number}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="expiry_month">Month</Label>
                                    <Input
                                        id="expiry_month"
                                        type="text"
                                        value={data.expiry_month}
                                        onChange={(e) => setData('expiry_month', e.target.value)}
                                        placeholder="12"
                                        maxLength={2}
                                        required
                                        className="mt-1"
                                    />
                                    {errors.expiry_month && (
                                        <p className="mt-1 text-sm text-red-600">{errors.expiry_month}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="expiry_year">Year</Label>
                                    <Input
                                        id="expiry_year"
                                        type="text"
                                        value={data.expiry_year}
                                        onChange={(e) => setData('expiry_year', e.target.value)}
                                        placeholder="25"
                                        maxLength={2}
                                        required
                                        className="mt-1"
                                    />
                                    {errors.expiry_year && (
                                        <p className="mt-1 text-sm text-red-600">{errors.expiry_year}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        type="text"
                                        value={data.cvv}
                                        onChange={(e) => setData('cvv', e.target.value)}
                                        placeholder="123"
                                        maxLength={4}
                                        required
                                        className="mt-1"
                                    />
                                    {errors.cvv && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                                    )}
                                </div>
                            </div>

                            {errors.payment && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-800">{errors.payment}</p>
                                </div>
                            )}
                            
                            {/* Display any other errors */}
                            {Object.keys(errors).length > 0 && !errors.payment && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-800 font-medium mb-2">Please check the following errors:</p>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {Object.entries(errors).map(([field, message]) => (
                                            <li key={field}>• {field}: {message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="border-t pt-6">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner />
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>Complete Subscription - {formattedPrice}</>
                                    )}
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-gray-500">
                                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                                    Your subscription will auto-renew {billingCycle === 'yearly' ? 'annually' : 'monthly'}.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}