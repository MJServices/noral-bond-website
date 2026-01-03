'use client';

import { useState } from 'react';

interface SidebarProps {
  onComingSoon?: () => void;
}

export default function Sidebar({ onComingSoon }: SidebarProps = {}) {
  const [activeItem, setActiveItem] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
    
    // Handle admin panel navigation
    if (itemId === 'admin') {
      window.open('/admin', '_blank');
      return;
    }
    
    if (onComingSoon) {
      onComingSoon();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'history', icon: '🕒', label: 'History' },
    { id: 'person', icon: '👤', label: 'Person' },
    { id: 'location', icon: '📍', label: 'Location' },
    { id: 'grid', icon: '▦', label: 'Grid' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="fixed left-0 top-0 h-full w-16 bg-black/40 backdrop-blur-sm border-r border-white/10 flex-col items-center py-6 z-50 hidden md:flex">
        {/* Logo - Star icon at top */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">⭐</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-4 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${
                activeItem === item.id
                  ? 'bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            </button>
          ))}
        </nav>

        {/* Bottom Profile - Yellow/Orange gradient circle with "Lv 12" */}
        <div className="mt-auto">
          <div className="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full flex items-center justify-center relative">
            <span className="text-white text-xs font-bold">Lv</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button - Only visible on mobile */}
      <button 
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-[60] md:hidden w-10 h-10 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <span className="text-white text-xl">⭐</span>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Sidebar - Slide in from left */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-black/90 backdrop-blur-sm border-r border-white/10 flex flex-col py-6 z-[60] md:hidden transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">⭐</span>
            </div>
            <span className="text-white font-semibold text-lg">AI Companion</span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Mobile Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? 'bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Profile Section */}
        <div className="mt-auto px-6">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full flex items-center justify-center relative">
              <span className="text-white text-sm font-bold">Lv</span>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">12</span>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold">Level 12</div>
              <div className="text-gray-400 text-sm">AI Companion User</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}