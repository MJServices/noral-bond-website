'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Check, ArrowRight, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthPageProps {
    onComplete: () => void;
}

export default function AuthPage({ onComplete }: AuthPageProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        password: '',
        confirmPassword: '',
        preferredRole: '',
        ageVerified: false,
        agreeTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Animation state
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const toggleMode = (newMode: 'signin' | 'signup') => {
        setIsVisible(false);
        setTimeout(() => {
            setMode(newMode);
            setIsVisible(true);
        }, 300);
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                // Age Verification Logic
                if (!formData.dob) {
                    throw new Error("Please enter your Date of Birth");
                }

                const age = calculateAge(formData.dob);
                if (age < 18) {
                    throw new Error("You must be 18 years or older to sign up");
                }

                if (!formData.ageVerified) {
                    throw new Error("You must certify that you are 18 years of age or older");
                }

                if (!formData.preferredRole) {
                    throw new Error("Please select a preferred role");
                }

                const { error } = await supabase.auth.signUp({
                    email: formData.email.trim(),
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.name,
                            dob: formData.dob,
                            age: age,
                            preferred_role: formData.preferredRole,
                            is_adult: true,
                            age_verified: true
                        }
                    }
                });
                if (error) throw error;

                onComplete();
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email.trim(),
                    password: formData.password
                });

                if (error) throw error;

                // Check for age verification
                // const metadata = data.user?.user_metadata;
                // if (!metadata?.is_adult && !metadata?.age_verified) {
                //     await supabase.auth.signOut();
                //     throw new Error("Access Denied: Age Verification Required");
                // }

                onComplete();
                console.log("Login completed successfully, skipping age verification check.");
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication');
            console.error('Auth error:', err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
            <div className="min-h-full w-full flex items-center justify-center p-4">
                {/* Dynamic Background */}
                <div className="fixed inset-0 overflow-hidden">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                    >
                        <source src="/video/WhatsApp Video 2025-12-31 at 1.50.52 PM.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0E1B20]/90 via-[#1A1A2E]/80 to-[#16213E]/90" />

                    {/* Animated Orbs */}
                    <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-glow duration-[4000ms]`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] animate-pulse-glow duration-[5000ms]`} />
                </div>

                {/* Auth Card */}
                <div
                    className={`relative w-full max-w-[480px] transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    {/* Glass Effect Container */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20">

                        {/* Header Section */}
                        <div className="pt-8 pb-6 px-8 text-center relative">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#8459E2] to-[#EC4899] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300">
                                <Sparkles className="text-white w-8 h-8" />
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2 font-montserrat tracking-tight">
                                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-white/60 text-sm font-inter">
                                {mode === 'signin'
                                    ? 'Continue your journey with your AI companion'
                                    : 'Start your personalized AI companion experience'}
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <div className="px-8 mb-8">
                            <div className="flex p-1 bg-black/40 rounded-xl relative">
                                <div
                                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-gradient-to-r from-[#8459E2]/20 to-[#EC4899]/20 border border-white/10 rounded-lg shadow-sm transition-all duration-300 ease-out ${mode === 'signin' ? 'left-1' : 'left-[calc(50%)]'
                                        }`}
                                />
                                <button
                                    onClick={() => mode !== 'signin' && toggleMode('signin')}
                                    className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${mode === 'signin' ? 'text-white' : 'text-white/40 hover:text-white/60'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => mode !== 'signup' && toggleMode('signup')}
                                    className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${mode === 'signup' ? 'text-white' : 'text-white/40 hover:text-white/60'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="px-8 pb-8">
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <span className="text-red-200 text-sm">{error}</span>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {mode === 'signup' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-white/70 ml-1">Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#EC4899] transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Your name"
                                                    className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#EC4899]/50 focus:bg-white/5 transition-all duration-300 text-sm"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-white/70 ml-1">Date of Birth</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#EC4899] transition-colors" />
                                                <input
                                                    type="date"
                                                    className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#EC4899]/50 focus:bg-white/5 transition-all duration-300 text-sm [color-scheme:dark]"
                                                    value={formData.dob}
                                                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                                    required
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-white/70 ml-1">{mode === 'signup' ? 'Email' : 'Email Address'}</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#8459E2] transition-colors" />
                                        <input
                                            type="email"
                                            placeholder={mode === 'signup' ? "your@email.com" : "name@example.com"}
                                            className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#8459E2]/50 focus:bg-white/5 transition-all duration-300 text-sm"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            autoComplete={mode === 'signup' ? 'off' : 'email'}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-white/70 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#EC4899] transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Your Password"
                                            className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-[#EC4899]/50 focus:bg-white/5 transition-all duration-300 text-sm"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {mode === 'signup' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-white/70 ml-1">Confirm Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#EC4899] transition-colors" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter Your Password"
                                                    className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-[#EC4899]/50 focus:bg-white/5 transition-all duration-300 text-sm"
                                                    value={formData.confirmPassword}
                                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-1">
                                            <label className="text-xs font-medium text-white/70 ml-1">Preferred Role</label>
                                            <div className="relative group">
                                                <select
                                                    className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#8459E2]/50 focus:bg-white/5 transition-all duration-300 text-sm appearance-none cursor-pointer"
                                                    value={formData.preferredRole}
                                                    onChange={e => setFormData({ ...formData, preferredRole: e.target.value })}
                                                    required
                                                >
                                                    <option value="" disabled className="bg-[#1A1A2E] text-white/50">Select your preferred role</option>
                                                    <option value="dominant" className="bg-[#1A1A2E]">Dominant</option>
                                                    <option value="switch" className="bg-[#1A1A2E]">Switch</option>
                                                    <option value="submissive" className="bg-[#1A1A2E]">Submissive</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 space-y-3">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        className="peer appearance-none w-5 h-5 border border-white/20 rounded-full bg-white/5 checked:bg-transparent checked:border-[#EC4899] transition-all duration-200"
                                                        checked={formData.ageVerified}
                                                        onChange={e => setFormData({ ...formData, ageVerified: e.target.checked })}
                                                        required
                                                    />
                                                    <div className="absolute w-3 h-3 bg-[#EC4899] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                </div>
                                                <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                                                    I certify that I am 18 years of age or older
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        className="peer appearance-none w-5 h-5 border border-white/20 rounded-full bg-white/5 checked:bg-transparent checked:border-[#EC4899] transition-all duration-200"
                                                        checked={formData.agreeTerms}
                                                        onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                                        required
                                                    />
                                                    <div className="absolute w-3 h-3 bg-[#EC4899] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                                                        I agree to the Terms of Service and Privacy Policy
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </>
                                )}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                {mode === 'signin' ? 'Login' : (
                                                    <>
                                                        Create account <ArrowRight className="w-4 h-4 ml-1" />
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Safe & Secure Footer - Only in Sign Up mode or both? Screenshot implies signup form context */}
                        {mode === 'signup' && (
                            <div className="px-8 pb-8">
                                <div className="bg-[#0f1115] border border-white/5 rounded-xl p-4">
                                    <h4 className="text-[#4ADE80] font-medium text-sm mb-1">Safe & Secure</h4>
                                    <p className="text-white/60 text-xs leading-relaxed">
                                        Your privacy and safety are our top priorities. All interactions are encrypted and consensual.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
}
