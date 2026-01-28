'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Check, X, Zap, Crown, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string, priceName: string) => {
        if (priceName === 'Free') {
            router.push('/');
            return;
        }

        setLoading(priceId);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, priceName }),
            });

            const { sessionId } = await res.json();
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            if (stripe) {
                const { error } = await (stripe as any).redirectToCheckout({ sessionId });
                if (error) console.error('Stripe redirect error:', error);
            }
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const tiers = [
        {
            name: 'Free',
            price: '$0',
            description: 'For casual explorers',
            icon: Shield,
            features: [
                { name: 'Courses', value: '❌', available: false },
                { name: 'Image / Day', value: '5', available: true },
                { name: 'Video / Day', value: '❌', available: false },
                { name: 'Image Quality', value: 'Low', available: true },
                { name: 'Video Quality', value: '720p', available: true },
                { name: 'Custom Personality', value: '❌', available: false },
            ],
            cta: 'Current Plan',
            priceId: 'free_tier_id', // Placeholder, handled in logic
            color: 'gray'
        },
        {
            name: 'Standard',
            price: '$9.99',
            period: '/month',
            description: 'For dedicated learners',
            icon: Zap,
            popular: true,
            features: [
                { name: 'Courses', value: '5', available: true },
                { name: 'Image / Day', value: '50', available: true },
                { name: 'Video / Day', value: '20', available: true },
                { name: 'Image Quality', value: 'High', available: true },
                { name: 'Video Quality', value: '1080p', available: true },
                { name: 'Custom Personality', value: 'Basic', available: true },
            ],
            cta: 'Upgrade to Standard',
            priceId: 'price_1SuAIUC1FHouzqEPNqlqfMP0', // Standard Plan
            color: 'blue'
        },
        {
            name: 'Premium',
            price: '$19.99',
            period: '/month',
            description: 'For power users',
            icon: Crown,
            features: [
                { name: 'Courses', value: 'Unlimited', available: true },
                { name: 'Image / Day', value: 'Unlimited', available: true },
                { name: 'Video / Day', value: 'Unlimited', available: true },
                { name: 'Image Quality', value: 'Ultra', available: true },
                { name: 'Video Quality', value: '4K', available: true },
                { name: 'Custom Personality', value: 'Full', available: true },
            ],
            cta: 'Get Premium',
            priceId: 'price_1SuAIVC1FHouzqEP7qmGQ0B9', // Premium Plan
            color: 'purple'
        },
    ];

    return (
        <div className="min-h-screen bg-[#0E1113] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Choose Your Path
                </h2>
                <p className="mt-4 text-xl text-gray-400">
                    Unlock the full potential of your AI companion
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative rounded-2xl border ${tier.popular ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-white/10'
                            } bg-[#1A1D21] p-8 flex flex-col transition-transform hover:scale-105 duration-300`}
                    >
                        {tier.popular && (
                            <div className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold uppercase tracking-wide">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{tier.description}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${tier.color}-500/10 text-${tier.color}-400`}>
                                <tier.icon className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">{tier.price}</span>
                            {tier.period && <span className="text-gray-400 text-sm">{tier.period}</span>}
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature.name} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-300">{feature.name}</span>
                                    <span className={`font-medium ${feature.available ? 'text-white' : 'text-gray-500'}`}>
                                        {feature.value}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(tier.priceId, tier.name)}
                            disabled={loading !== null && loading !== tier.priceId}
                            className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 
                                ${tier.name === 'Free'
                                    ? 'bg-white/5 hover:bg-white/10 text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow-lg shadow-blue-500/20'
                                }
                                ${loading && loading !== tier.priceId ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {loading === tier.priceId ? 'Processing...' : tier.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
