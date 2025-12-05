import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, Eye, EyeOff, Link, Shield, User, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    is_google_user: boolean;
    has_password: boolean;
    has_google_linked: boolean;
    properties_count: number;
}

interface PasswordStrength {
    score: number;
    level: 'weak' | 'medium' | 'strong';
    feedback: string[];
}

interface ProfileSetupProps {
    user: User;
    property_types: Record<string, string>;
}

export default function ProfileSetup({ user, property_types }: ProfileSetupProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        score: 0,
        level: 'weak',
        feedback: []
    });

    const { data, setData, post, processing, errors } = useForm({
        // User fields
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        password: '',
        password_confirmation: '',
        
        // Property fields
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

    // Check password strength when password changes
    useEffect(() => {
        if (data.password && (!user.has_password || user.is_google_user)) {
            const checkStrength = async () => {
                try {
                    const response = await fetch('/profile/password-strength', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                        body: JSON.stringify({ password: data.password }),
                    });
                    
                    if (response.ok) {
                        const strength = await response.json();
                        setPasswordStrength(strength);
                    }
                } catch (error) {
                    console.error('Error checking password strength:', error);
                }
            };

            checkStrength();
        }
    }, [data.password, user.has_password, user.is_google_user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/complete');
    };

    const handleLinkGoogle = () => {
        window.location.href = '/auth/google?link=true';
    };

    const getStrengthColor = (level: string) => {
        switch (level) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthText = (level: string) => {
        switch (level) {
            case 'weak': return 'Weak';
            case 'medium': return 'Medium';
            case 'strong': return 'Strong';
            default: return '';
        }
    };
        
            
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Complete Profile Setup',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Complete Profile Setup" />

            <div className="max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Rental Management Platform!</h1>
                    <p className="text-lg text-gray-600 mt-2">Let's get you set up with your profile and first property.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* User Profile Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Complete your personal profile information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email (read-only) */}
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {user.is_google_user && (
                                            <span className="flex items-center gap-1">
                                                <Check className="h-4 w-4 text-green-600" />
                                                Verified with Google
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Name fields */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="first_name">First Name *</Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                        {errors.first_name && (
                                            <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="last_name">Last Name *</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                        {errors.last_name && (
                                            <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password section for Google users or users without password */}
                                {(!user.has_password || user.is_google_user) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                                                <Shield className="h-5 w-5" />
                                                Set Up Password
                                            </h3>
                                            
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="password">Password *</Label>
                                                    <div className="relative mt-1">
                                                        <Input
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            value={data.password}
                                                            onChange={(e) => setData('password', e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Password strength indicator */}
                                                    {data.password && (
                                                        <div className="mt-2">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                    <div 
                                                                        className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength.level)}`}
                                                                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <Badge variant={passwordStrength.level === 'strong' ? 'default' : 'secondary'}>
                                                                    {getStrengthText(passwordStrength.level)}
                                                                </Badge>
                                                            </div>
                                                            {passwordStrength.feedback.length > 0 && (
                                                                <ul className="text-sm text-gray-600">
                                                                    {passwordStrength.feedback.map((tip, index) => (
                                                                        <li key={index} className="flex items-center gap-1">
                                                                            <AlertCircle className="h-3 w-3" />
                                                                            {tip}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {errors.password && (
                                                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                                    <div className="relative mt-1">
                                                        <Input
                                                            id="password_confirmation"
                                                            type={showPasswordConfirm ? "text" : "password"}
                                                            value={data.password_confirmation}
                                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                        >
                                                            {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    {errors.password_confirmation && (
                                                        <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Google linking for non-Google users */}
                                {!user.is_google_user && !user.has_google_linked && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Link Google Account (Optional)</h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                Link your Google account for easier sign-in and enhanced security.
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleLinkGoogle}
                                                className="flex items-center gap-2"
                                            >
                                                <Link className="h-4 w-4" />
                                                Link Google Account
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Property Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Add Your First Property
                                </CardTitle>
                                <CardDescription>
                                    Tell us about your first rental property to get started with property management
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                                            value={data.total_units}
                                            onChange={(e) => setData('total_units', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
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

                                {/* Description */}
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={processing}
                            className="px-8"
                        >
                            {processing ? 'Setting up...' : 'Complete Setup'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}