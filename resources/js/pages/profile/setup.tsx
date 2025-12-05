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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
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
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // User fields
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        password: '',
        password_confirmation: '',
        avatar: '',
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
        post('/profile/complete', {
            onSuccess: () => {
                window.location.href = '/profile/property/setup';
            }
        });
    };

    const handleLinkGoogle = () => {
        window.location.href = '/auth/google?link=true';
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setAvatarUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                setAvatarPreview(base64String);
                setData('avatar', base64String);
                setAvatarUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setAvatarUploading(false);
            alert('Failed to upload avatar. Please try again.');
        }
    };

    const getAvatarSrc = () => {
        if (avatarPreview) return avatarPreview;
        if (user.avatar) return user.avatar;
        return null;
    };

    const getInitials = () => {
        if (user.first_name && user.last_name) {
            return (user.first_name[0] + user.last_name[0]).toUpperCase();
        }
        if (user.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return user.name[0].toUpperCase();
        }
        return 'U';
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

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 py-12">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                            Complete Your <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Profile Setup</span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            Let's get your personal information set up first, then we'll help you add your first property.
                        </p>
                    </div>
                </div>
                
                <div className="px-4 sm:px-6 lg:px-8 py-12">

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                            {/* Profile Picture Section */}
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl col-span-5 xl:col-span-2">
                                <CardHeader className="rounded-t-2xl border-orange-100 pb-6 text-center">
                                    <CardTitle className="text-xl font-bold mb-4">
                                        Welcome {user.first_name
                                            ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) + (user.last_name ? ' ' + user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1) : '')
                                            : user.name.charAt(0).toUpperCase() + user.name.slice(1)}!
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        <div className="relative inline-block">
                                            <Avatar className="size-60 xl:size-80 mx-auto mb-4 border-4 border-orange-100">
                                                <AvatarImage 
                                                    src={getAvatarSrc() || undefined} 
                                                    alt={user.name || 'Profile'}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="text-4xl xl:text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                            
                                            {/* Upload Button Overlay */}
                                            <div className="absolute bottom-4 right-4 xl:bottom-6 xl:right-6">
                                                <label htmlFor="avatar-upload" className="cursor-pointer">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200">
                                                        {avatarUploading ? (
                                                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </label>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    className="hidden"
                                                    disabled={avatarUploading}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Profile Picture</p>
                                            <p className="text-xs text-gray-500">
                                                {user.is_google_user && !data.avatar ? 
                                                    'Using Google profile picture' : 
                                                    'Click the camera icon to upload'
                                                }
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Max 5MB • JPG, PNG, GIF</p>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* User Profile Section */}
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl col-span-5 xl:col-span-3">
                                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl border-b border-orange-100 pb-6">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-2">
                                        📝 Complete your personal profile information to get started
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
                                                            <div className="mt-3">
                                                                <div className="flex items-center space-x-3 mb-2">
                                                                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                                                        <div 
                                                                            className={`h-3 rounded-full transition-all duration-500 ${getStrengthColor(passwordStrength.level)} shadow-sm`}
                                                                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                    <div className={`flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-full ${
                                                                        passwordStrength.level === 'weak' ? 'bg-red-100 text-red-700' : 
                                                                        passwordStrength.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                                        'bg-green-100 text-green-700'
                                                                    }`}>
                                                                        {passwordStrength.level === 'weak' && <span>🔴</span>}
                                                                        {passwordStrength.level === 'medium' && <span>🟡</span>}
                                                                        {passwordStrength.level === 'strong' && <span>🟢</span>}
                                                                        <span>{getStrengthText(passwordStrength.level)}</span>
                                                                    </div>
                                                                </div>
                                                                {passwordStrength.feedback.length > 0 && (
                                                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                                        <ul className="text-sm text-orange-800 space-y-1">
                                                                            {passwordStrength.feedback.map((tip, index) => (
                                                                                <li key={index} className="flex items-center gap-2">
                                                                                    <AlertCircle className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                                                                    {tip}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
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
                                            <Separator className="bg-orange-100" />
                                            <div className="text-center p-6 border border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-orange-900 mb-2">
                                                    🔗 Link Your Google Account
                                                </h4>
                                                <p className="text-sm text-orange-700 mb-4 font-medium">
                                                    Optional: Link your Google account for easier sign-ins and enhanced security.
                                                </p>
                                                <Button
                                                    type="button"
                                                    onClick={handleLinkGoogle}
                                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                                                >
                                                    <Link className="h-4 w-4 mr-2" />
                                                    🚀 Link Google Account
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>


                        </div>

                        {/* Submit */}
                        <div className="text-center">
                            <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl p-8">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        👤 Complete Your Profile Setup
                                    </h3>
                                    <p className="text-gray-600">
                                        Finish setting up your personal information, then we'll help you add your first property!
                                    </p>
                                </div>
                                
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={processing}
                                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xl font-bold px-12 py-4 shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    {processing ? (
                                        <div className="flex items-center space-x-2">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Saving Profile...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Continue to Property Setup →</span>
                                        </div>
                                    )}
                                </Button>
                                
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
                                        <span>2 Minutes</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>One-time Setup</span>
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