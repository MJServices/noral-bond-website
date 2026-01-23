'use client';

import { useState } from 'react';
import { Menu, Wallet, LogOut, ArrowDownCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0E1113]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
            {/* Left Section: Logo & Mobile Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#8459E2] to-[#EC4899] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <span className="font-bold text-white text-lg font-montserrat tracking-tighter">LO</span>
                    </div>
                    {/* Placeholder Logo Text usually invisible on mobile or small */}
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Wallet Button */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all font-medium text-sm">
                    <Wallet className="w-4 h-4" />
                    <span>Wallet</span>
                </button>

                {/* Log Out Button */}
                <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                </button>

                {/* Deposit Button (Primary) */}
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF4500] hover:opacity-90 text-white shadow-lg shadow-orange-500/20 transition-all font-bold text-sm">
                    <ArrowDownCircle className="w-4 h-4" />
                    <span>Deposit</span>
                </button>

                {/* Profile Avatar (Placeholder) */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8459E2] to-[#EC4899] p-[2px] cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#1A1D21] flex items-center justify-center">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`}
                            alt="Profile"
                            className="w-full h-full rounded-full"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
