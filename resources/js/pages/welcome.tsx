import { dashboard, login } from '@/routes';

// Simple route helper for subscription routes
const route = (routeName: string, params?: string | Record<string, string>) => {
    const routes: Record<string, string> = {
        'subscription.index': '/subscription',
        'subscription.select': '/subscription/select',
        'subscription.subscribe': '/subscription/subscribe',
        'subscription.trial': '/subscription/trial',
        'subscription.cancel': '/subscription/cancel'
    };
    
    let url = routes[routeName] || routeName;
    
    // Handle route parameters (simple implementation)
    if (typeof params === 'string') {
        url = url + '/' + params;
    }
    
    return url;
};
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
    BuildingOfficeIcon, 
    CheckIcon, 
    CurrencyDollarIcon, 
    DocumentChartBarIcon,
    UserGroupIcon,
    ChartBarIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: BuildingOfficeIcon,
            title: 'Property Management',
            description: 'Manage multiple properties, units, and tenants from one dashboard.'
        },
        {
            icon: CurrencyDollarIcon,
            title: 'Rent Collection',
            description: 'Automated rent collection with payment reminders and tracking.'
        },
        {
            icon: DocumentChartBarIcon,
            title: 'Financial Reports',
            description: 'Comprehensive reporting and analytics for your rental business.'
        },
        {
            icon: UserGroupIcon,
            title: 'Tenant Management',
            description: 'Track applications, leases, and maintenance requests.'
        },
        {
            icon: ChartBarIcon,
            title: 'Analytics Dashboard',
            description: 'Real-time insights into occupancy, revenue, and performance.'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Secure & Compliant',
            description: 'Enterprise-grade security with data protection compliance.'
        }
    ];

    const benefits = [
        'Save 10+ hours per week on property management tasks',
        'Reduce vacancy rates with streamlined tenant screening',
        'Never miss rent payments with automated reminders',
        'Professional reporting for tax and accounting purposes',
        'Mobile-friendly access from anywhere, anytime',
        'Dedicated support team for all your questions'
    ];

    return (
        <>
            <Head title="RentFlow - Complete Rental Management Solution">
                <meta name="description" content="Streamline your rental property management with our comprehensive platform. Manage properties, tenants, and finances all in one place." />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                                RentFlow
                            </Link>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Features
                            </a>
                            <a href="#pricing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Pricing
                            </a>
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        href={route('subscription.index')} 
                                        className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                                    >
                                        Subscription
                                    </Link>
                                    <Link href={dashboard()}>
                                        <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">Dashboard</Button>
                                    </Link>
                                </div>
                            ) : (
                                <Link href={login()}>
                                    <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg">
                                        Sign in with Google
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Dashboard</Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Sign In</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Simplify Your
                            <span className="text-blue-600 block">Rental Management</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Streamline property management, automate rent collection, and grow your rental business with our comprehensive platform designed for modern landlords.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <div className="flex gap-4">
                                    <Link href={dashboard()}>
                                        <Button size="lg" className="px-8">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={route('subscription.index')}>
                                        <Button size="lg" variant="outline" className="px-8">
                                            View Plans
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Link href={login()}>
                                    <Button size="lg" className="px-8 py-4">
                                        Start Free Trial - Sign in with Google
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            14-day free trial • No credit card required • Start managing properties today
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Manage Rentals
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From property listings to rent collection, we've got all the tools you need to run a successful rental business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Why Choose RentFlow?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Join thousands of landlords who have transformed their rental business with our comprehensive management platform.
                            </p>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckIcon className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="bg-white rounded-lg shadow-xl p-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">1,500+</div>
                                    <div className="text-gray-600 mb-6">Properties Managed</div>
                                    <div className="text-2xl font-bold text-green-600 mb-2">$2.5M+</div>
                                    <div className="text-gray-600 mb-6">Monthly Rent Collected</div>
                                    <div className="text-2xl font-bold text-purple-600 mb-2">98%</div>
                                    <div className="text-gray-600">Customer Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Start with our free trial and upgrade as your portfolio grows. All plans include our core features with no hidden fees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="border border-gray-200 rounded-lg p-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Starter</h3>
                            <div className="text-4xl font-bold text-gray-900 mb-2">$29.99</div>
                            <div className="text-gray-600 mb-6">per month</div>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Up to 5 properties</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>25 units max</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Basic reporting</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Email support</span>
                                </li>
                            </ul>
                            {auth.user ? (
                                <Link href={route('subscription.index')}>
                                    <Button variant="outline" className="w-full">
                                        Select Plan
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button variant="outline" className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <div className="border-2 border-blue-600 rounded-lg p-8 text-center relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional</h3>
                            <div className="text-4xl font-bold text-gray-900 mb-2">$59.99</div>
                            <div className="text-gray-600 mb-6">per month</div>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Up to 25 properties</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>100 units max</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Advanced analytics</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Priority support</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Custom branding</span>
                                </li>
                            </ul>
                            {auth.user ? (
                                <Link href={route('subscription.index')}>
                                    <Button className="w-full">
                                        Select Plan
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-lg p-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
                            <div className="text-4xl font-bold text-gray-900 mb-2">$129.99</div>
                            <div className="text-gray-600 mb-6">per month</div>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Unlimited properties</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Unlimited units</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>API access</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Phone support</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span>White-label options</span>
                                </li>
                            </ul>
                            {auth.user ? (
                                <Link href={route('subscription.index')}>
                                    <Button variant="outline" className="w-full">
                                        Select Plan
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button variant="outline" className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-4">
                            All plans include a 14-day free trial. No setup fees. Cancel anytime.
                        </p>
                        {!auth.user && (
                            <Link href={login()}>
                                <Button size="lg" className="px-8">
                                    Start Your Free Trial
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-amber-700 py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="cta-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="10" cy="10" r="1" fill="white" fillOpacity="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#cta-pattern)" />
                    </svg>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Rental Business?
                        </h2>
                        <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of successful landlords who trust RentFlow to manage their properties efficiently and profitably.
                        </p>
                        {auth.user ? (
                            <Link href={dashboard()}>
                                <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-10 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200">
                                    Access Your Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href={login()}>
                                <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-10 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200">
                                    Start Free Trial Today
                                </Button>
                            </Link>
                        )}
                        
                        {/* Trust indicators */}
                        <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                                <div className="text-orange-100 text-sm">Happy Landlords</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                                <div className="text-orange-100 text-sm">Uptime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                                <div className="text-orange-100 text-sm">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4 block">
                                RentFlow
                            </Link>
                            <p className="text-gray-400 mb-4 max-w-md">
                                The complete rental management platform for modern landlords. Streamline your operations and grow your business.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                {auth.user && (
                                    <li><Link href={route('subscription.index')} className="text-gray-400 hover:text-white transition-colors">Subscription</Link></li>
                                )}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-4">Account</h3>
                            <ul className="space-y-2">
                                {auth.user ? (
                                    <>
                                        <li><Link href={dashboard()} className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                                        <li><Link href={route('subscription.index')} className="text-gray-400 hover:text-white transition-colors">My Subscription</Link></li>
                                    </>
                                ) : (
                                    <li><Link href={login()} className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                                )}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2025 RentFlow. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}