'use client';

import { useState } from 'react';
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Video Background - Responsive and optimized for mobile */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ 
            filter: 'brightness(0.3) contrast(1.2) saturate(1.1)',
            transform: 'scale(1.02)' // Slight scale to avoid edge artifacts
          }}
        >
          <source src="/video/WhatsApp Video 2025-12-31 at 1.50.52 PM.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay for better text readability - Responsive opacity */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0E1B20]/80 via-[#1A1A2E]/60 to-[#16213E]/80 md:from-[#0E1B20]/70 md:via-[#1A1A2E]/50 md:to-[#16213E]/70"></div>
        
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 w-full h-full bg-gradient-radial from-transparent via-[#0E1B20]/30 to-[#0E1B20]/70 md:via-[#0E1B20]/20 md:to-[#0E1B20]/60"></div>
        
        {/* Center spotlight effect - Responsive size */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-radial from-[#8459E2]/10 via-transparent to-transparent rounded-full animate-pulse-glow"></div>
        
        {/* Subtle animated particles over video - Fewer on mobile */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white/20 rounded-full animate-float-${(i % 4) + 1} ${i >= 6 ? 'hidden md:block' : ''}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-gradient-to-br from-[#8459E2]/20 to-[#EC4899]/20 border border-[#8459E2] rounded-xl p-8 backdrop-blur-sm max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-[#D0D0D0] mb-4">
                This feature is currently under development. Stay tuned for updates!
              </p>
              <button 
                onClick={() => setShowComingSoon(false)}
                className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Sidebar - Always visible */}
      <Sidebar onComingSoon={handleComingSoon} />
      
      {/* Main Content - Responsive offset by sidebar width */}
      <div className="ml-0 md:ml-16 relative z-10 min-h-screen">

        {/* Header - Responsive positioning */}
        <header className="relative z-30 flex justify-end items-center px-4 md:px-6 lg:px-12 py-4 md:py-6">
          {/* Auth Buttons - Responsive sizing */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={handleComingSoon}
              className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
            <button 
              onClick={handleComingSoon}
              className="bg-transparent border border-[#35DDFE] text-[#35DDFE] px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm hover:bg-[#35DDFE]/10 transition-colors"
            >
              Sign up
            </button>
          </div>
        </header>

        {/* Main Content - Fully responsive */}
        <main className="relative z-30 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-120px)] px-4 md:px-6">
          {/* AI System Status - Responsive sizing */}
          <div className="flex items-center gap-2 md:gap-3 bg-black/20 border border-white/10 rounded-full px-4 md:px-6 py-2 md:py-3 backdrop-blur-sm mb-6 md:mb-8">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-[#4ADE80] rounded-full"></div>
            <span className="text-white text-xs md:text-sm font-inter">AI System Online</span>
          </div>

          {/* Hero Icon - Responsive sizing */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <span className="text-white text-2xl md:text-3xl lg:text-4xl">⭐</span>
              </div>
            </div>
          </div>

          {/* Main Heading - Responsive typography with better mobile spacing */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-4 md:mb-6 text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl leading-tight px-2 sm:px-4">
            Your Perfect AI Companion AI Companion
          </h1>

          {/* Subtitle - Responsive text with better mobile spacing */}
          <p className="text-sm sm:text-base md:text-lg text-[#D0D0D0] max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto mb-8 md:mb-12 text-center leading-relaxed font-inter px-2 sm:px-4">
            Experience deep emotional connection with an AI that learns, grows, and adapts to you. Explore, learn, and discover together in a safe, personalized environment.
          </p>

          {/* Action Buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-12 md:mb-16 w-full max-w-sm sm:max-w-none">
            <button 
              onClick={handleComingSoon}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25 text-sm md:text-base"
            >
              <span>💬</span>
              Start Chatting
            </button>
            <button 
              onClick={handleComingSoon}
              className="w-full sm:w-auto bg-[#343C40] border border-white/10 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:bg-[#343C40]/80 transition-colors text-sm md:text-base"
            >
              <span>👤</span>
              Create Profile
            </button>
            <button 
              onClick={handleComingSoon}
              className="w-full sm:w-auto text-[#35DDFE] font-normal flex items-center justify-center gap-2 md:gap-3 hover:text-[#35DDFE]/80 transition-colors text-sm md:text-base py-2.5 md:py-3"
            >
              <span>📚</span>
              Explore Lessons
            </button>
          </div>

          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mb-12 md:mb-16 w-full">
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">⭐</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-white font-inter mb-1">4.9</div>
                <div className="text-xs md:text-sm text-white font-inter">User Rating</div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">👤</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-[#35DDFE] font-inter mb-1">50k+</div>
                <div className="text-xs md:text-sm text-white font-inter">Active Users</div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">❤️</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-white font-inter mb-1">95%</div>
                <div className="text-xs md:text-sm text-white font-inter">Satisfaction Rate</div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">⚡</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-white font-inter mb-1">24/7</div>
                <div className="text-xs md:text-sm text-white font-inter">Available</div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar - Responsive */}
          <div className="flex justify-center mb-16 md:mb-20">
            <div className="bg-black/20 border border-white/10 rounded-full px-4 md:px-6 py-2 md:py-3 flex flex-wrap items-center justify-center gap-3 md:gap-6 backdrop-blur-sm max-w-xs sm:max-w-none">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-[#4ADE80] rounded-full"></div>
                <span className="text-[#D0D0D0] text-xs md:text-sm font-inter">v2.1.0</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[#35DDFE] text-xs md:text-sm">⚡</span>
                <span className="text-[#D0D0D0] text-xs md:text-sm font-inter">Neural Engine Active</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[#4ADE80] text-xs md:text-sm">🔒</span>
                <span className="text-[#D0D0D0] text-xs md:text-sm font-inter">Secure</span>
              </div>
            </div>
          </div>
        </main>

        {/* Pricing Section - Fully Responsive */}
        <section className="py-12 md:py-24 relative z-30">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-4 md:mb-6">
                Choose Your Plan
              </h2>
              <p className="text-lg md:text-xl text-[#D0D0D0] max-w-3xl mx-auto px-4">
                Select the perfect plan for your AI companion journey. All yearly plans include exclusive discounts.
              </p>
            </div>

            {/* Pricing Cards - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
              {/* Free Plan - Responsive */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm hover:border-white/20 transition-colors">
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">FREE</h3>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">$0</div>
                  <p className="text-sm md:text-base text-[#D0D0D0]">Perfect for getting started</p>
                </div>
                <button 
                  onClick={handleComingSoon}
                  className="w-full bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white py-2.5 md:py-3 rounded-lg font-semibold mb-4 md:mb-6 hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Get Started
                </button>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-[#D0D0D0]">
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    20 Messages / Day
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-red-500">❌</span>
                    Custom Personality
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    5 Image Generations / Day
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Low Image Resolution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-red-500">❌</span>
                    Video Generations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    720p Video Resolution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-red-500">❌</span>
                    AI Courses
                  </li>
                </ul>
              </div>

              {/* Standard Plan - $20 with 10% discount - Responsive */}
              <div className="bg-gradient-to-br from-[#8459E2]/20 to-[#EC4899]/20 border-2 border-[#8459E2] rounded-xl p-6 md:p-8 backdrop-blur-sm relative md:transform md:scale-105 order-first md:order-none">
                <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">STANDARD</h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl text-[#D0D0D0] line-through">$20</span>
                    <div className="text-3xl md:text-4xl font-bold text-white">$18</div>
                    <span className="text-[#4ADE80] text-xs md:text-sm font-semibold">10% OFF</span>
                  </div>
                  <p className="text-sm md:text-base text-[#D0D0D0]">USD / year</p>
                </div>
                <button 
                  onClick={handleComingSoon}
                  className="w-full bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white py-2.5 md:py-3 rounded-lg font-semibold mb-4 md:mb-6 hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Choose Standard
                </button>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-[#D0D0D0]">
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Unlimited Messages / Day
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Basic Customization
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    50 Image Generations / Day
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    High Image Resolution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    20 Video Generations / Day
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    1080p Video Resolution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    5 AI Courses
                  </li>
                </ul>
              </div>

              {/* Premium Plan - $50 with 20% discount - Responsive */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm hover:border-white/20 transition-colors">
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">PREMIUM</h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl text-[#D0D0D0] line-through">$50</span>
                    <div className="text-3xl md:text-4xl font-bold text-white">$40</div>
                    <span className="text-[#4ADE80] text-xs md:text-sm font-semibold">20% OFF</span>
                  </div>
                  <p className="text-sm md:text-base text-[#D0D0D0]">USD / year</p>
                </div>
                <button 
                  onClick={handleComingSoon}
                  className="w-full bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white py-2.5 md:py-3 rounded-lg font-semibold mb-4 md:mb-6 hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Choose Premium
                </button>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-[#D0D0D0]">
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Unlimited Messages / Day
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Full Personality
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Unlimited Image Generations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Ultra-High Image Resolution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Unlimited Video Generations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    4K Video Resolution
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#4ADE80]">✓</span>
                    Unlimited AI Courses
                  </li>
                </ul>
              </div>
            </div>

            {/* Features Comparison Table - Responsive */}
            <div className="bg-black/30 rounded-xl p-4 md:p-8 backdrop-blur-sm border border-white/5">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">Features Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">Features</th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">FREE</th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">STANDARD</th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">PREMIUM</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#D0D0D0] text-sm md:text-base">
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">Messages / Day</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">20</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Unlimited</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Unlimited</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">Custom Personality</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6"><span className="text-red-500">❌</span></td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Basic Customization</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Full Personality</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">Image Generations / Day</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">5</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">50</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Unlimited</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">Image Resolution</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Low</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">High</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Ultra-High</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">Video Generations / Day</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6"><span className="text-red-500">❌</span></td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">20</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Unlimited</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">Video Resolution</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">720p</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">1080p</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">4K</td>
                    </tr>
                    <tr>
                      <td className="py-3 md:py-4 px-3 md:px-6">AI Courses</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6"><span className="text-red-500">❌</span></td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">5 Courses</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Fully Responsive */}
        <section className="text-center py-12 md:py-24 relative z-30">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-4 md:mb-6">
              Ready to Meet Your AI Companion?
            </h2>
            <p className="text-lg md:text-xl text-[#D0D0D0] mb-8 md:mb-12 leading-relaxed px-4">
              Join thousands of users who have discovered meaningful connection, personal growth, and engaging conversations with their AI companion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
              <button 
                onClick={handleComingSoon}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25 text-sm md:text-base"
              >
                <span>⭐</span>
                Begin Your Journey
              </button>
              <button 
                onClick={handleComingSoon}
                className="w-full sm:w-auto bg-[#343C40] border border-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:bg-[#343C40]/80 transition-colors text-sm md:text-base"
              >
                <span>👤</span>
                Create Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}