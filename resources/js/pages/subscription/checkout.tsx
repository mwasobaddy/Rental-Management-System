import React, { useState, useEffect } from 'react';
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
    formattedPrice: string;
}

export default function Checkout({
    tier,
    billingCycle,
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

    const [nextBillingDate, setNextBillingDate] = useState('');
    useEffect(() => {
        const ms = billingCycle === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        // Avoid setting state synchronously inside the effect to prevent cascading renders
        const id = setTimeout(() => {
            setNextBillingDate(new Date(Date.now() + ms).toLocaleDateString());
        }, 0);
        return () => clearTimeout(id);
    }, [billingCycle]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Subscribe to ${tier.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Complete Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Subscription</span>
                            </h1>
                            <p className="text-gray-600 text-lg">You're one step away from transforming your rental business</p>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Plan Summary */}
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-orange-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order Summary
                            </h2>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {tier.name} Plan
                                        </h3>
                                        {tier.name === 'Professional' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-600 text-white">
                                                ⭐ Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">
                                        {tier.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-orange-700">
                                        {formattedPrice}
                                    </p>
                                    <p className="text-sm text-orange-600 font-medium">
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

                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold">
                                    💳 Total Today:
                                </span>
                                <span className="text-3xl font-bold">
                                    {formattedPrice}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-orange-100">
                                {billingCycle === 'yearly' && (
                                    <p className="text-sm flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Next billing: {nextBillingDate}</span>
                                    </p>
                                )}
                                {billingCycle === 'monthly' && (
                                    <p className="text-sm flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Next billing: {nextBillingDate}</span>
                                    </p>
                                )}
                                <div className="flex items-center space-x-2 text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-orange-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Payment Information
                            </h2>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 mb-8">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-sm text-orange-800 font-semibold">
                                        Demo Mode Active
                                    </p>
                                    <p className="text-sm text-orange-700 mt-1">
                                        This is a demonstration. No actual payment will be processed. Use any test values in the form below.
                                    </p>
                                </div>
                            </div>
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

                            <div className="border-t border-orange-100 pt-8">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg font-semibold py-4 shadow-xl transform hover:scale-105 transition-all duration-200"
                                    size="lg"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-3">
                                            <Spinner />
                                            <span>🔄 Processing Payment...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>🚀 Complete Subscription - {formattedPrice}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>

                            <div className="text-center">
                                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mt-4">
                                    <p className="text-sm text-orange-800 flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <span>
                                            By subscribing, you agree to our Terms of Service and Privacy Policy.
                                        </span>
                                    </p>
                                    <p className="text-xs text-orange-700 mt-1">
                                        Your subscription will auto-renew {billingCycle === 'yearly' ? 'annually' : 'monthly'}. Cancel anytime.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}