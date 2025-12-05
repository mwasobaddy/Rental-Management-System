import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, Building2, Sparkles, Shield, TrendingUp } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleGoogleSuccess = () => {
        window.location.href = '/auth/google';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-orange-950 flex items-center justify-center p-4">
            <Head title="Welcome Back - Log In" />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 dark:from-orange-400/5 dark:to-orange-500/5"></div>
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Brand Story */}
                <div className="hidden lg:block space-y-8 px-8">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">RentalPro</h1>
                                <p className="text-orange-600 dark:text-orange-400 font-medium">Property Management Excellence</p>
                            </div>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                            Manage Your Properties Like a 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"> Pro</span>
                        </h2>
                        
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            Streamline your rental business with our comprehensive platform. From tenant management to financial tracking, we've got you covered.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-orange-900/30">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Smart Analytics</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Real-time insights into your portfolio performance</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-orange-900/30">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Secure & Compliant</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Bank-grade security for your sensitive data</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-orange-900/30">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Growth Focused</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Scale from 1 to 1000+ properties seamlessly</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl border border-orange-200/50 dark:border-orange-700/30">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="flex -space-x-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">+5,000 landlords trust us</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                            "RentalPro transformed how I manage my properties. The automation alone saves me 10+ hours per week!"
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">- Sarah Chen, Portfolio Owner</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full max-w-md mx-auto lg:max-w-lg">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-200/50 dark:border-orange-700/30 p-8 space-y-8">
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center space-y-3">
                            <div className="flex justify-center">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                            <p className="text-slate-600 dark:text-slate-300">Sign in to manage your properties</p>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                            <p className="text-slate-600 dark:text-slate-300">Sign in to your dashboard and continue growing your business</p>
                        </div>

                        {status && (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 rounded-xl">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">{status}</p>
                            </div>
                        )}

                        {/* Google Sign-In */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 group"
                            onClick={handleGoogleSuccess}
                            tabIndex={1}
                        >
                            <svg className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="font-medium">Continue with Google</span>
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 dark:text-slate-400 font-medium tracking-wider">
                                    Or sign in with email
                                </span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                className="h-12 px-4 border-2 border-slate-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl bg-slate-50 dark:bg-slate-700 transition-all duration-200"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors duration-200"
                                                        tabIndex={6}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="h-12 px-4 pr-12 border-2 border-slate-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl bg-slate-50 dark:bg-slate-700 transition-all duration-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={4}
                                                className="border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-orange-500 dark:data-[state=checked]:bg-orange-400 data-[state=checked]:border-orange-500 dark:data-[state=checked]:border-orange-400"
                                            />
                                            <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                Keep me signed in
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-400 dark:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? (
                                            <div className="flex items-center space-x-2">
                                                <Spinner className="h-5 w-5" />
                                                <span>Signing in...</span>
                                            </div>
                                        ) : (
                                            <span>Sign In to Dashboard</span>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Footer */}
                        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                            <p>Don't have an account? 
                                <span className="ml-1 text-orange-600 dark:text-orange-400 font-semibold">Sign up with Google above</span>
                            </p>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>99.9% Uptime</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Sparkles className="h-3 w-3" />
                            <span>GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
