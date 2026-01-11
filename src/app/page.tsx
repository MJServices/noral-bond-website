"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";

interface LandingPageContent {
  hero_heading: string;
  hero_subheading: string;
  hero_button_chat_text: string;
  hero_button_profile_text: string;
  hero_button_explore_text: string;
  stats_rating_value: string;
  stats_rating_label: string;
  stats_users_value: string;
  stats_users_label: string;
  stats_satisfaction_value: string;
  stats_satisfaction_label: string;
  stats_availability_value: string;
  stats_availability_label: string;
  pricing_heading: string;
  pricing_subheading: string;
  blog_heading: string;
  blog_subheading: string;
  newsletter_heading: string;
  newsletter_subheading: string;
  footer_text: string;
}

const defaultContent: LandingPageContent = {
  hero_heading: "Your Perfect AI Companion",
  hero_subheading:
    "Experience deep emotional connection with an AI that learns, grows, and adapts to you. Explore, learn, and discover together in a safe, personalized environment.",
  hero_button_chat_text: "Start Chatting",
  hero_button_profile_text: "Create Profile",
  hero_button_explore_text: "Explore Lessons",
  stats_rating_value: "4.9",
  stats_rating_label: "User Rating",
  stats_users_value: "50k+",
  stats_users_label: "Active Users",
  stats_satisfaction_value: "95%",
  stats_satisfaction_label: "Satisfaction Rate",
  stats_availability_value: "24/7",
  stats_availability_label: "Available",
  pricing_heading: "Choose Your Plan",
  pricing_subheading:
    "Select the perfect plan for your AI companion journey. All yearly plans include exclusive discounts.",
  blog_heading: "Latest Insights",
  blog_subheading:
    "Discover the latest in AI technology, tips, and insights from our experts. Stay ahead of the curve with cutting-edge knowledge.",
  newsletter_heading: "Stay in the Loop",
  newsletter_subheading:
    "Join our newsletter to get the latest updates, AI tips, and exclusive offers delivered straight to your inbox.",
  footer_text: "© 2025 NeuralBond. All rights reserved.",
};

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any>(null);
  const [content, setContent] = useState<LandingPageContent>(defaultContent);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch("/api/landing-content");
        if (response.ok) {
          const data = await response.json();
          // Only update if we got valid data back
          if (data && !data.error) {
            setContent((prev) => ({ ...prev, ...data }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing content:", error);
      }
    }
    fetchContent();
  }, []);

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
            filter: "brightness(0.3) contrast(1.2) saturate(1.1)",
            transform: "scale(1.02)", // Slight scale to avoid edge artifacts
          }}
        >
          <source
            src="/video/WhatsApp Video 2025-12-31 at 1.50.52 PM.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay for better text readability - Responsive opacity */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0E1B20]/80 via-[#1A1A2E]/60 to-[#16213E]/80 md:from-[#0E1B20]/70 md:via-[#1A1A2E]/50 md:to-[#16213E]/70"></div>

        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 w-full h-full bg-gradient-radial from-transparent via-[#0E1B20]/30 to-[#0E1B20]/70 md:via-[#0E1B20]/20 md:to-[#0E1B20]/60"></div>

        {/* Center spotlight effect - Responsive size */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-radial from-[#8459E2]/10 via-transparent to-transparent rounded-full animate-pulse-glow"></div>

        {/* Subtle animated particles over video - Fewer on mobile */}
        <FloatingParticles />
      </div>
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-gradient-to-br from-[#8459E2]/20 to-[#EC4899]/20 border border-[#8459E2] rounded-xl p-8 backdrop-blur-sm max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Coming Soon!
              </h3>
              <p className="text-[#D0D0D0] mb-4">
                This feature is currently under development. Stay tuned for
                updates!
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

      {/* Blog Post Modal */}
      {selectedBlogPost && (
        <BlogPostModal
          post={selectedBlogPost}
          onClose={() => setSelectedBlogPost(null)}
        />
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
            <span className="text-white text-xs md:text-sm font-inter">
              AI System Online
            </span>
          </div>

          {/* Hero Icon - Responsive sizing */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <span className="text-white text-2xl md:text-3xl lg:text-4xl">
                  ⭐
                </span>
              </div>
            </div>
          </div>

          {/* Main Heading - Responsive typography with better mobile spacing */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-4 md:mb-6 text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl leading-tight px-2 sm:px-4">
            {content.hero_heading}
          </h1>

          {/* Subtitle - Responsive text with better mobile spacing */}
          <p className="text-sm sm:text-base md:text-lg text-[#D0D0D0] max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto mb-8 md:mb-12 text-center leading-relaxed font-inter px-2 sm:px-4">
            {content.hero_subheading}
          </p>

          {/* Action Buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-12 md:mb-16 w-full max-w-sm sm:max-w-none">
            <button
              onClick={handleComingSoon}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25 text-sm md:text-base"
            >
              <span>💬</span>
              {content.hero_button_chat_text}
            </button>
            <button
              onClick={handleComingSoon}
              className="w-full sm:w-auto bg-[#343C40] border border-white/10 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:bg-[#343C40]/80 transition-colors text-sm md:text-base"
            >
              <span>👤</span>
              {content.hero_button_profile_text}
            </button>
            <button
              onClick={handleComingSoon}
              className="w-full sm:w-auto text-[#35DDFE] font-normal flex items-center justify-center gap-2 md:gap-3 hover:text-[#35DDFE]/80 transition-colors text-sm md:text-base py-2.5 md:py-3"
            >
              <span>📚</span>
              {content.hero_button_explore_text}
            </button>
          </div>

          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mb-12 md:mb-16 w-full">
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">⭐</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-white font-inter mb-1">
                  {content.stats_rating_value}
                </div>
                <div className="text-xs md:text-sm text-white font-inter">
                  {content.stats_rating_label}
                </div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">👤</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-[#35DDFE] font-inter mb-1">
                  {content.stats_users_value}
                </div>
                <div className="text-xs md:text-sm text-white font-inter">
                  {content.stats_users_label}
                </div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">❤️</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-white font-inter mb-1">
                  {content.stats_satisfaction_value}
                </div>
                <div className="text-xs md:text-sm text-white font-inter">
                  {content.stats_satisfaction_label}
                </div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full flex items-center justify-center mb-2 md:mb-4">
                <span className="text-sm md:text-xl">⚡</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-white font-inter mb-1">
                  {content.stats_availability_value}
                </div>
                <div className="text-xs md:text-sm text-white font-inter">
                  {content.stats_availability_label}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar - Responsive */}
          <div className="flex justify-center mb-16 md:mb-20">
            <div className="bg-black/20 border border-white/10 rounded-full px-4 md:px-6 py-2 md:py-3 flex flex-wrap items-center justify-center gap-3 md:gap-6 backdrop-blur-sm max-w-xs sm:max-w-none">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-[#4ADE80] rounded-full"></div>
                <span className="text-[#D0D0D0] text-xs md:text-sm font-inter">
                  v2.1.0
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[#35DDFE] text-xs md:text-sm">⚡</span>
                <span className="text-[#D0D0D0] text-xs md:text-sm font-inter">
                  Neural Engine Active
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[#4ADE80] text-xs md:text-sm">🔒</span>
                <span className="text-[#D0D0D0] text-xs md:text-sm font-inter">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Pricing Section - Fully Responsive */}
        <section className="py-12 md:py-24 relative z-30">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-4 md:mb-6">
                {content.pricing_heading}
              </h2>
              <p className="text-lg md:text-xl text-[#D0D0D0] max-w-3xl mx-auto px-4">
                {content.pricing_subheading}
              </p>
            </div>

            {/* Pricing Cards - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
              {/* Free Plan - Responsive */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm hover:border-white/20 transition-colors">
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    FREE
                  </h3>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    $0
                  </div>
                  <p className="text-sm md:text-base text-[#D0D0D0]">
                    Perfect for getting started
                  </p>
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
                    <span className="text-[#4ADE80]">✓</span>5 Image Generations
                    / Day
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
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    STANDARD
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl text-[#D0D0D0] line-through">
                      $20
                    </span>
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      $18
                    </div>
                    <span className="text-[#4ADE80] text-xs md:text-sm font-semibold">
                      10% OFF
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#D0D0D0]">
                    USD / year
                  </p>
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
                    <span className="text-[#4ADE80]">✓</span>5 AI Courses
                  </li>
                </ul>
              </div>

              {/* Premium Plan - $50 with 20% discount - Responsive */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm hover:border-white/20 transition-colors">
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    PREMIUM
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl text-[#D0D0D0] line-through">
                      $50
                    </span>
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      $40
                    </div>
                    <span className="text-[#4ADE80] text-xs md:text-sm font-semibold">
                      20% OFF
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#D0D0D0]">
                    USD / year
                  </p>
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
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
                Features Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">
                        Features
                      </th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">
                        FREE
                      </th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">
                        STANDARD
                      </th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-6 text-white font-semibold text-sm md:text-base">
                        PREMIUM
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#D0D0D0] text-sm md:text-base">
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        Messages / Day
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        20
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Unlimited
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Unlimited
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        Custom Personality
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        <span className="text-red-500">❌</span>
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Basic Customization
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Full Personality
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        Image Generations / Day
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        5
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        50
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Unlimited
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        Image Resolution
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Low
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        High
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Ultra-High
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        Video Generations / Day
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        <span className="text-red-500">❌</span>
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        20
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Unlimited
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        Video Resolution
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        720p
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        1080p
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        4K
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 md:py-4 px-3 md:px-6">AI Courses</td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        <span className="text-red-500">❌</span>
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        5 Courses
                      </td>
                      <td className="text-center py-3 md:py-4 px-3 md:px-6">
                        Unlimited
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="py-12 md:py-16 relative z-30">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {content.newsletter_heading}
              </h2>
              <p className="text-lg text-[#D0D0D0] mb-8">
                {content.newsletter_subheading}
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <BlogSection
          onSelectPost={setSelectedBlogPost}
          heading={content.blog_heading}
          subheading={content.blog_subheading}
        />

        {/* CTA Section - Fully Responsive */}
        <section className="text-center py-12 md:py-24 relative z-30">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-4 md:mb-6">
              Ready to Meet Your AI Companion?
            </h2>
            <p className="text-lg md:text-xl text-[#D0D0D0] mb-8 md:mb-12 leading-relaxed px-4">
              Join thousands of users who have discovered meaningful connection,
              personal growth, and engaging conversations with their AI
              companion.
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

        {/* Footer */}
        <footer className="py-8 text-center relative z-30 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <p className="text-[#D0D0D0] text-sm">{content.footer_text}</p>
        </footer>
      </div>
    </div>
  );
}

// Newsletter Signup Component
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to subscribe. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsSubscribed(true);
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error) {
      console.error("Subscription error:", error);
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {isSubscribed ? (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
          <div className="text-green-400 text-3xl mb-3">✓</div>
          <h4 className="text-white font-semibold mb-2">
            Successfully Subscribed!
          </h4>
          <p className="text-white/60 text-sm">
            Thank you for joining our newsletter.
          </p>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#8459E2] transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {errorMessage && (
            <div className="mt-3 text-red-400 text-sm text-center">
              {errorMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Blog Section Component
function BlogSection({
  onSelectPost,
  heading = "Latest Insights",
  subheading = "Discover the latest in AI technology, tips, and insights from our experts. Stay ahead of the curve with cutting-edge knowledge.",
}: {
  onSelectPost: (post: any) => void;
  heading?: string;
  subheading?: string;
}) {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);

    // Fetch blog posts from API
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog-posts");
        const data = await response.json();

        if (!response.ok) {
          setError("Failed to load blog posts");
          setIsLoading(false);
          return;
        }

        setBlogPosts(data.posts || []);
      } catch (error) {
        console.error("Error loading blog posts:", error);
        setError("Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <section className="py-12 md:py-16 relative z-30">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-[#EC4899] to-[#35DDFE] rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-4 py-2 rounded-full text-sm font-semibold">
                📚 {heading}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              {heading}
            </h2>
            <p className="text-lg text-[#D0D0D0] max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="skeleton h-10 w-10 rounded-full mb-4"></div>
                <div className="skeleton h-4 w-3/4 rounded mb-2"></div>
                <div className="skeleton h-3 w-1/2 rounded mb-4"></div>
                <div className="skeleton h-6 w-full rounded mb-2"></div>
                <div className="skeleton h-6 w-4/5 rounded mb-4"></div>
                <div className="skeleton h-3 w-full rounded mb-2"></div>
                <div className="skeleton h-3 w-3/4 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                  <div className="skeleton h-6 w-20 rounded-full"></div>
                </div>
                <div className="skeleton h-8 w-24 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 relative z-30">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-[#35DDFE] to-[#8459E2] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-[#EC4899] to-[#35DDFE] rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-4 py-2 rounded-full text-sm font-semibold">
              📚 {heading}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            {heading}
          </h2>
          <p className="text-lg text-[#D0D0D0] max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Failed to load blog posts
            </h3>
            <p className="text-white/60 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No blog posts yet
            </h3>
            <p className="text-white/60">
              Check back soon for exciting content!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
              {blogPosts.slice(0, 3).map((post, index) => (
                <div
                  key={post.id}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer group relative overflow-hidden"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                  onClick={() => onSelectPost(post)}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8459E2]/5 to-[#EC4899]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#8459E2] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-white/70 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags
                        .slice(0, 2)
                        .map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-[#8459E2]/20 text-[#8459E2] text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      {post.tags.length > 2 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-[#8459E2] to-[#EC4899] text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                        Read More
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blogPosts.length > 3 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
                  <span className="text-2xl group-hover:animate-bounce">
                    📚
                  </span>
                  <div>
                    <div className="text-white font-semibold">
                      {blogPosts.length - 3} more posts available
                    </div>
                    <div className="text-white/60 text-sm">
                      Explore our complete library
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// Blog Post Modal Component
function BlogPostModal({ post, onClose }: { post: any; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
    >
      <div className="bg-gradient-to-br from-[#0E1B20] via-[#1A1A2E] to-[#16213E] border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-4">
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#8459E2]/20 text-[#8459E2] text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-white mb-4 mt-6"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold text-white mb-3 mt-5"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-semibold text-white mb-2 mt-4"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-4 text-white/80 leading-relaxed text-base md:text-lg"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-white" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside mb-4 space-y-2 text-white/80"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside mb-4 space-y-2 text-white/80"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-white/80 text-base md:text-lg"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[#8459E2] hover:text-[#EC4899] underline"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Key Takeaways */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-[#8459E2]/10 to-[#EC4899]/10 border border-[#8459E2]/20 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💡</span> Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {post.keyTakeaways.map((takeaway: string, index: number) => (
                    <li
                      key={index}
                      className="text-white/80 flex items-start gap-3"
                    >
                      <span className="text-[#8459E2] mt-1">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Topics */}
            {post.relatedTopics && post.relatedTopics.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.relatedTopics.map((topic: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// Floating Particles Component - Client-side only to prevent hydration issues
function FloatingParticles() {
  const [particles, setParticles] = useState<
    Array<{
      left: number;
      top: number;
      animationDelay: number;
      animationDuration: number;
    }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate particles on client side only
    const newParticles = [...Array(12)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 4 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 w-full h-full"></div>;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {particles.map((particle, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 bg-white/20 rounded-full animate-float-${
            (i % 4) + 1
          } ${i >= 6 ? "hidden md:block" : ""}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Utility function to format dates consistently
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Recently";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}
