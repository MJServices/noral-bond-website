'use client';

import { useState } from 'react';
import {
  Home,
  MessageCircle,
  User,
  Trophy,
  BookOpen,
  Settings,
  Sparkles,
  Crown
} from 'lucide-react';
import { useXP } from '@/hooks/useXP';

interface SidebarProps {
  onComingSoon?: () => void;
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

export default function Sidebar({ onComingSoon, activeItem = 'home', onNavigate }: SidebarProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { stats } = useXP();

  const handleClick = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked

    // Handle admin panel navigation
    if (itemId === 'admin') {
      window.open('/admin', '_blank');
      return;
    }

    // if (itemId === 'pricing') {
    //   // Navigate to the separate pricing page
    //   window.location.href = '/pricing';
    //   return;
    // }

    // Only trigger coming soon if it's not a handled route
    if (onComingSoon && !['home', 'chat', 'profile', 'achievements', 'library', 'settings'].includes(itemId)) {
      onComingSoon();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="fixed left-0 top-0 h-full w-18 bg-[#0E1113] border-none flex flex-col items-center py-6 z-50 hidden md:flex">
        {/* Logo - Sparkles icon at top with gradient background */}
        <div className="mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-[#C27AFF] to-[#EC4899] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-8 flex-1 w-full items-center">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`group relative flex items-center justify-center transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                  }`}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  strokeWidth={1.5}
                />

                {isActive && (
                  <div className="absolute -right-[18px] top-1/2 -translate-y-1/2 w-1 h-5 bg-[#C27AFF] rounded-l-full shadow-[0_0_10px_rgba(194,122,255,0.5)]" />
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1A1D21] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/5 shadow-xl">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile - Gold Crown with real Level */}
        <div className="mt-auto mb-6 flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/30">
            <Crown className="text-[#D4AF37] w-5 h-5" strokeWidth={1.5} />
          </div>
          <span className="text-[#9CA3AF] text-[10px] font-medium tracking-wide">Lv.{stats.level}</span>
        </div>
      </div>

      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-[60] md:hidden w-10 h-10 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <Sparkles className="text-white w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Sidebar - Slide in from left */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#0E1113] border-r border-white/5 flex flex-col py-6 z-[60] md:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-white font-semibold text-lg">AI Companion</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-white/60 hover:text-white"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Mobile Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1 px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-[#8459E2]/20 to-[#EC4899]/20 text-white border border-[#8459E2]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#C27AFF]' : ''}`} strokeWidth={1.5} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Profile Section */}
        <div className="mt-auto px-6">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/30">
              <Crown className="text-[#D4AF37] w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Level {stats.level}</div>
              <div className="text-[#D4AF37] text-xs">XP: {stats.xp}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}