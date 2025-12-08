import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Building, Crown, Zap } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    subscription?: {
        tier: {
            id: number;
            name: string;
            slug: string;
            max_properties: number | null;
            max_units: number | null;
            max_tenants: number | null;
        };
        remaining_properties?: number;
        current_units?: number;
        remaining_units?: number;
    };
}

interface PropertySetupProps {
    user: User;
    property_types: Record<string, string>;
}

export default function PropertySetup({ user, property_types }: PropertySetupProps) {
    const { data, setData, post, processing, errors } = useForm({
        property_name: '',
        property_type: '',
        property_address: '',
        property_city: '',
        property_state: '',
        property_postal_code: '',
        property_country: 'US',
        total_units: '1',
        purchase_price: '',
        monthly_rent: '',
        purchase_date: '',
        description: '',
        amenities: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/property/complete', {
            onError: (errors) => {
                // Show validation errors
                Object.values(errors).forEach(error => {
                    if (typeof error === 'string') {
                        toast.error(error);
                    }
                });
            }
        });
    };

    const getTierIcon = (tierName: string) => {
        switch (tierName.toLowerCase()) {
            case 'trial': return <Zap className="h-5 w-5" />;
            case 'starter': return <Home className="h-5 w-5" />;
            case 'professional': return <Building className="h-5 w-5" />;
            case 'enterprise': return <Crown className="h-5 w-5" />;
            default: return <Home className="h-5 w-5" />;
        }
    };

    const getTierColor = (tierName: string) => {
        switch (tierName.toLowerCase()) {
            case 'trial': return 'from-gray-600 to-gray-700';
            case 'starter': return 'from-blue-600 to-blue-700';
            case 'professional': return 'from-purple-600 to-purple-700';
            case 'enterprise': return 'from-orange-600 to-orange-700';
            default: return 'from-orange-600 to-orange-700';
        }
    };

    const getMaxProperties = () => {
        // Prefer remaining properties if available, otherwise fallback to tier limit
        if (typeof user.subscription?.remaining_properties === 'number') {
            return user.subscription.remaining_properties;
        }
        return user.subscription?.tier.max_properties ?? 'Unlimited';
    };

    // Use per-subscription remaining units if present (computed on backend), otherwise show tier limit
    const getMaxUnits = () => {
        return user.subscription?.remaining_units ?? user.subscription?.tier.max_units ?? 'Unlimited';
    };

    const getMaxUnitsNumber = () => {
        const val = user.subscription?.remaining_units ?? user.subscription?.tier.max_units;
        return typeof val === 'number' ? val : undefined;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Property Setup',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Property Setup" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 py-12">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                                    Add Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">First Property</span>
                                </h1>
                                <p className="text-xl text-gray-600">
                                    Welcome {user.first_name}! Let's set up your first rental property to get started.
                                </p>
                            </div>
                            
                            {/* Subscription Tier Badge */}
                            {user.subscription && (
                                <div className="hidden md:block">
                                    <Badge className={`bg-gradient-to-r ${getTierColor(user.subscription.tier.name)} text-white px-4 py-2 text-sm font-semibold shadow-lg`}>
                                        <div className="flex items-center gap-2">
                                            {getTierIcon(user.subscription.tier.name)}
                                            <span>{user.subscription.tier.name} Plan</span>
                                        </div>
                                    </Badge>
                                </div>
                            )}
                        </div>
                        
                        {/* Plan Limits */}
                        {user.subscription && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-orange-600" />
                                        <span className="text-sm font-medium text-gray-700">Max Properties:</span>
                                        <span className="text-sm font-bold text-orange-600">{getMaxProperties()}</span>
                                    </div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-orange-600" />
                                        <span className="text-sm font-medium text-gray-700">Max Units:</span>
                                        <span className="text-sm font-bold text-orange-600">{getMaxUnits()}</span>
                                    </div>
                                    {user.subscription?.current_units !== undefined && (
                                        <p className="text-xs text-gray-500 mt-1">Used: {user.subscription.current_units} • Remaining: {user.subscription.remaining_units ?? 'Unlimited'}</p>
                                    )}
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-orange-600" />
                                        <span className="text-sm font-medium text-gray-700">Current Plan:</span>
                                        <span className="text-sm font-bold text-orange-600">{user.subscription.tier.name}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="px-4 sm:px-6 lg:px-8 py-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Property Setup Section */}
                        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl max-w-4xl mx-auto">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl border-b border-orange-100 pb-6">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                                        <Home className="h-5 w-5 text-white" />
                                    </div>
                                    Property Information
                                </CardTitle>
                                <CardDescription className="text-gray-600 mt-2">
                                    🏠 Tell us about your rental property to get started with property management
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-8">
                                {/* Basic property info */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="property_name">Property Name *</Label>
                                        <Input
                                            id="property_name"
                                            type="text"
                                            value={data.property_name}
                                            onChange={(e) => setData('property_name', e.target.value)}
                                            placeholder="e.g., Downtown Apartments, Oak Street House"
                                            required
                                            className="mt-1"
                                        />
                                        {errors.property_name && (
                                            <p className="text-red-600 text-sm mt-1">{errors.property_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="property_type">Property Type *</Label>
                                        <Select value={data.property_type} onValueChange={(value) => setData('property_type', value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select property type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(property_types).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.property_type && (
                                            <p className="text-red-600 text-sm mt-1">{errors.property_type}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <Label htmlFor="property_address">Street Address *</Label>
                                    <Input
                                        id="property_address"
                                        type="text"
                                        value={data.property_address}
                                        onChange={(e) => setData('property_address', e.target.value)}
                                        placeholder="123 Main Street"
                                        required
                                        className="mt-1"
                                    />
                                    {errors.property_address && (
                                        <p className="text-red-600 text-sm mt-1">{errors.property_address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="property_city">City *</Label>
                                        <Input
                                            id="property_city"
                                            type="text"
                                            value={data.property_city}
                                            onChange={(e) => setData('property_city', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                        {errors.property_city && (
                                            <p className="text-red-600 text-sm mt-1">{errors.property_city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="property_state">State/Province *</Label>
                                        <Input
                                            id="property_state"
                                            type="text"
                                            value={data.property_state}
                                            onChange={(e) => setData('property_state', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                        {errors.property_state && (
                                            <p className="text-red-600 text-sm mt-1">{errors.property_state}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="property_postal_code">ZIP/Postal Code *</Label>
                                        <Input
                                            id="property_postal_code"
                                            type="text"
                                            value={data.property_postal_code}
                                            onChange={(e) => setData('property_postal_code', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                        {errors.property_postal_code && (
                                            <p className="text-red-600 text-sm mt-1">{errors.property_postal_code}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Property details */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="total_units">Number of Units *</Label>
                                        <Input
                                            id="total_units"
                                            type="number"
                                            min="1"
                                            max={getMaxUnitsNumber() || undefined}
                                            value={data.total_units}
                                            onChange={(e) => setData('total_units', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                        {user.subscription?.tier.max_units && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Maximum {getMaxUnits()} units on your {user.subscription.tier.name} plan
                                            </p>
                                        )}
                                        {errors.total_units && (
                                            <p className="text-red-600 text-sm mt-1">{errors.total_units}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="purchase_price">Purchase Price (Optional)</Label>
                                        <Input
                                            id="purchase_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.purchase_price}
                                            onChange={(e) => setData('purchase_price', e.target.value)}
                                            placeholder="350000"
                                            className="mt-1"
                                        />
                                        {errors.purchase_price && (
                                            <p className="text-red-600 text-sm mt-1">{errors.purchase_price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="monthly_rent">Monthly Rent (Optional)</Label>
                                        <Input
                                            id="monthly_rent"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.monthly_rent}
                                            onChange={(e) => setData('monthly_rent', e.target.value)}
                                            placeholder="2500"
                                            className="mt-1"
                                        />
                                        {errors.monthly_rent && (
                                            <p className="text-red-600 text-sm mt-1">{errors.monthly_rent}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Advanced Features for Higher Tiers */}
                                {user.subscription && user.subscription.tier.name !== 'Trial' && (
                                    <div className="border-t border-orange-100 pt-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Crown className="h-5 w-5 text-orange-600" />
                                            Advanced Property Details
                                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                                                {user.subscription.tier.name} Feature
                                            </Badge>
                                        </h4>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="purchase_date">Purchase Date (Optional)</Label>
                                                <Input
                                                    id="purchase_date"
                                                    type="date"
                                                    value={data.purchase_date}
                                                    onChange={(e) => setData('purchase_date', e.target.value)}
                                                    className="mt-1"
                                                />
                                                {errors.purchase_date && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.purchase_date}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="description">Property Description (Optional)</Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Describe your property, including key features and amenities..."
                                                    rows={3}
                                                    className="mt-1"
                                                />
                                                {errors.description && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submit Section */}
                        <div className="text-center">
                            <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl p-8 max-w-2xl mx-auto">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        🏠 Ready to Add Your Property?
                                    </h3>
                                    <p className="text-gray-600">
                                        Complete your property setup and start managing rentals efficiently!
                                    </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                    >
                                        ← Back to Profile
                                    </Button>
                                    
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg font-bold px-8 py-3 shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        {processing ? (
                                            <div className="flex items-center space-x-2">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Adding Property...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Home className="w-5 h-5" />
                                                <span>Add Property & Continue</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                                
                                <div className="flex items-center justify-center space-x-8 mt-6 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>Secure Setup</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>1 Minute</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}