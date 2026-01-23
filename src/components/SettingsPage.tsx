'use client';

import {
    User,
    Shield,
    FileText,
    Sliders,
    Mail,
    Eye,
    EyeOff,
    Smartphone,
    MessageCircle,
    Calendar,
    BookOpen,
    Heart,
    Database,
    MapPin,
    Fingerprint,
    Trash2,
    Download,
    AlertTriangle,
    Info,
    ChevronDown,
    Palette,
    Bell,
    Volume2,
    RefreshCw,
    Globe,
    Type,
    Moon,
    Check,
    HeartHandshake,
    X,
    AlertCircle,
    Timer,
    FileKey,
    Phone
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className="flex flex-col min-h-screen bg-[#0E1113] p-4 md:p-8 lg:p-12 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-3">
                    Settings
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                    Manage your account, privacy, and app preferences
                </p>
            </div>

            <div className="max-w-4xl mx-auto w-full space-y-8">
                {/* Tab Navigation */}
                <div className="flex p-1 bg-[#1A1D21] border border-white/5 rounded-xl">
                    {[
                        { id: 'account', label: 'Account', icon: User },
                        { id: 'privacy', label: 'Privacy', icon: Shield },
                        { id: 'preferences', label: 'Preferences', icon: Sliders },
                        { id: 'consent', label: 'Consent', icon: FileText },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-[#2A2D31] text-white shadow-lg border border-white/5' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'account' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Account Information */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-[#8459E2]" />
                                <h3 className="text-lg font-bold text-white">Account Information</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Update your account details and contact information
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            defaultValue="your@email.com"
                                            className="w-full bg-[#0E1113] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-gray-400 text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                        />
                                        <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white">Account Status</label>
                                    <div className="flex gap-2 min-h-[46px] items-center">
                                        <span className="bg-[#8459E2]/10 border border-[#8459E2]/20 text-[#8459E2] text-[10px] uppercase font-bold px-3 py-1.5 rounded-full">
                                            Verified
                                        </span>
                                        <span className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] uppercase font-bold px-3 py-1.5 rounded-full">
                                            Premium
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C27AFF] to-[#EC4899] hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-pink-500/20 transition-opacity">
                                Save Change
                            </button>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-[#8459E2]" />
                                <h3 className="text-lg font-bold text-white">Security Settings</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Manage your password and security features
                            </p>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-white mb-4">Change Password</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">Current Password</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0" /> {/* Spacer */}
                                            <input
                                                type="password"
                                                placeholder="your@email.com" // Placeholder matches screenshot though contextually weird for password
                                                className="w-full bg-[#0E1113] border border-white/10 rounded-lg py-3 pl-4 pr-10 text-gray-400 text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                            />
                                            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">New Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="your@email.com"
                                                className="w-full bg-[#0E1113] border border-white/10 rounded-lg py-3 pl-4 pr-10 text-gray-400 text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                            />
                                            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="your@email.com"
                                                className="w-full bg-[#0E1113] border border-white/10 rounded-lg py-3 pl-4 pr-10 text-gray-400 text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                            />
                                            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                                <button className="px-6 py-2.5 rounded-lg border border-white/5 bg-[#2A2D31] text-gray-400 text-xs font-bold hover:bg-[#32363b] transition-colors">
                                    Update Password
                                </button>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-white mb-4">Two-Factor Authentication</h4>
                                <div className="bg-[#0E1113] border border-white/5 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
                                            <Smartphone className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">Authenticator App</div>
                                            <div className="text-xs text-gray-500">Disable</div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 rounded bg-gradient-to-r from-[#EC4899] to-[#EC4899] hover:opacity-90 text-white text-[10px] font-bold shadow-lg shadow-pink-500/20">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'privacy' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Data Collection & Usage */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Data Collection & Usage</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Control how your data is collected and used to improve your experience
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Conversation Analysis</div>
                                        <div className="text-xs text-gray-500">Allow AI to analyze conversations for personalization</div>
                                    </div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Conversation History</div>
                                        <div className="text-xs text-gray-500">Store conversation history for context and improvement</div>
                                    </div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Anonymous Analytics</div>
                                        <div className="text-xs text-gray-500">Share anonymous usage data to improve the app</div>
                                    </div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Visibility */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="w-5 h-5 text-[#10B981]" />
                                <h3 className="text-lg font-bold text-white">Privacy & Visibility</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Control who can see your profile and activity
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Profile Visibility</label>
                                    <div className="relative">
                                        <button className="w-full flex items-center justify-between bg-[#0E1113] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                Private - Only You
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Location Sharing</div>
                                        <div className="text-xs text-gray-500">Share general location for better recommendations</div>
                                    </div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                        </div>

                        {/* Security Settings (Biometric) */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-[#EC4899]" />
                                <h3 className="text-lg font-bold text-white">Security Settings</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Protect your account with advanced security features
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Biometric Authentication</div>
                                        <div className="text-xs text-gray-500">Use Fingerprint or Face ID to secure app access</div>
                                    </div>
                                    <Toggle checked={true} color="bg-[#8459E2]" />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Session Timeout: 30 Minutes</div>
                                    <div className="relative h-2 bg-[#2A2D31] rounded-full">
                                        <div className="absolute left-0 top-0 h-full w-1/4 bg-[#8459E2] rounded-full" />
                                        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8459E2] border-2 border-[#1A1D21] rounded-full shadow-lg cursor-pointer" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                                        <span>5 min</span>
                                        <span>55 min</span>
                                        <span>2 hrs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Data Management</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Manage your stored data and conversation history
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <div className="text-white font-medium mb-1">Auto-Delete Messages</div>
                                        <div className="text-xs text-gray-500">Automatically delete old conversations</div>
                                    </div>
                                    <Toggle checked={false} />
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Export My Data
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-500/20">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Commitment */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                                <h3 className="text-sm font-bold text-white">Privacy Commitment</h3>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-3">
                                Your privacy is our priority. All conversations are encrypted end-to-end, and no personal data is shared with third parties. You have full control over your data and can delete it at any time.
                            </p>
                            <div className="flex gap-3">
                                <span className="text-[10px] text-gray-500 font-medium">End-to-end Encrypted</span>
                                <span className="text-[10px] text-gray-500 font-medium">GDPR Compliant</span>
                                <span className="text-[10px] text-gray-500 font-medium">SOC 2 Certified</span>
                            </div>
                        </div>

                        {/* Settings & Privacy Info */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-[#35DDFE]" />
                                <h3 className="text-sm font-bold text-white">Settings & Privacy</h3>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-3">
                                Your settings are automatically saved and synced across devices. All changes take effect immediately. If you need help or have concerns, our support team is available 24/7.
                            </p>
                            <div className="flex gap-3">
                                <span className="text-[10px] text-gray-500 font-medium">Auto-Sync</span>
                                <span className="text-[10px] text-gray-500 font-medium">24/7 Support</span>
                                <span className="text-[10px] text-gray-500 font-medium">Secure</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Appearance */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Palette className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Appearance</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Customize the look and feel of your app
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Theme</label>
                                    <div className="relative">
                                        <button className="w-full flex items-center justify-between bg-[#0E1113] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Moon className="w-4 h-4 text-gray-500" />
                                                Dark
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Language</label>
                                    <div className="relative">
                                        <button className="w-full flex items-center justify-between bg-[#0E1113] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-500" />
                                                English
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Font Size: Med</div>
                                    <div className="relative h-2 bg-[#2A2D31] rounded-full">
                                        <div className="absolute left-0 top-0 h-full w-1/2 bg-[#8459E2] rounded-full" />
                                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8459E2] border-2 border-[#1A1D21] rounded-full shadow-lg cursor-pointer" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                                        <span>Small</span>
                                        <span>Medium</span>
                                        <span>Large</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Compact Mode</div>
                                        <div className="text-xs text-gray-500">Reduce spacing for more content on screen</div>
                                    </div>
                                    <Toggle checked={true} />
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Bell className="w-5 h-5 text-[#10B981]" />
                                <h3 className="text-lg font-bold text-white">Notifications</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Control when and how you receive notifications
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Enable Notifications</div>
                                        <div className="text-xs text-gray-500">Receive notifications for messages and updates</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Push Notifications</div>
                                        <div className="text-xs text-gray-500">Instant notifications on your device</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Email Notifications</div>
                                        <div className="text-xs text-gray-500">Important updates via email</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Message Preview</div>
                                        <div className="text-xs text-gray-500">Show message content in notifications</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Audio & Haptics */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Volume2 className="w-5 h-5 text-[#10B981]" /> {/* Using green as in screenshot */}
                                <h3 className="text-lg font-bold text-white">Audio & Haptics</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Configure sound and vibration settings
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Sound Effects</div>
                                        <div className="text-xs text-gray-500">Play sounds for messages and interactions</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Vibration</div>
                                        <div className="text-xs text-gray-500">Haptic feedback for interactions</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Chat Preferences */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <MessageCircle className="w-5 h-5 text-[#10B981]" /> {/* Using green/icon from screenshot */}
                                <h3 className="text-lg font-bold text-white">Chat Preferences</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Customize your conversation experience
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Auto-send with Enter</div>
                                        <div className="text-xs text-gray-500">Send messages when pressing Enter key</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Typing Indicator</div>
                                        <div className="text-xs text-gray-500">Show when AI companion is responding</div>
                                    </div>
                                    <Toggle checked={true} color="bg-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Reset Preferences */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <RefreshCw className="w-4 h-4 text-[#10B981]" />
                                <h3 className="text-lg font-bold text-white">Reset Preferences</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Restore all preferences to their default values
                            </p>
                            <button className="w-full py-3 rounded-lg bg-[#2A2D31] text-gray-400 text-sm font-medium hover:bg-[#32363b] transition-colors">
                                Reset Default
                            </button>
                        </div>

                        {/* Settings & Privacy Info */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-[#35DDFE]" />
                                <h3 className="text-sm font-bold text-white">Settings & Privacy</h3>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-3">
                                Your settings are automatically saved and synced across devices. All changes take effect immediately. If you need help or have concerns, our support team is available 24/7.
                            </p>
                            <div className="flex gap-3">
                                <span className="text-[10px] text-gray-500 font-medium">Auto-Sync</span>
                                <span className="text-[10px] text-gray-500 font-medium">24/7 Support</span>
                                <span className="text-[10px] text-gray-500 font-medium">Secure</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'consent' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Consent & Safety Banner */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-green-500" />
                                <h3 className="text-lg font-bold text-white">Consent & Safety</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Your safety and consent are our highest priorities. You have complete control over your experience.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center text-center">
                                    <Check className="w-6 h-6 text-green-500 mb-2" />
                                    <span className="text-xs text-gray-400 font-medium">Always Consensual</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <Shield className="w-6 h-6 text-blue-500 mb-2" />
                                    <span className="text-xs text-gray-400 font-medium">Private & Secure</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <HeartHandshake className="w-6 h-6 text-pink-500 mb-2" />
                                    <span className="text-xs text-gray-400 font-medium">Your Boundaries</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <X className="w-6 h-6 text-yellow-500 mb-2" />
                                    <span className="text-xs text-gray-400 font-medium">Stop Anytime</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Preferences */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-5 h-5 text-[#8459E2]" />
                                <h3 className="text-lg font-bold text-white">Content Preferences</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Control the type of content and interactions you're comfortable with
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-medium">Safe Mode</span>
                                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Recommended</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Restrict content to emotional support and gentle conversation only</div>
                                    </div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Couples Mode</div>
                                        <div className="text-xs text-gray-500">Enable shared experiences for couples</div>
                                    </div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                        </div>

                        {/* Safe Words & Emergency Controls */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                                <h3 className="text-lg font-bold text-white">Safe Words & Emergency Controls</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Configure words that immediately stop any interaction
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-white mb-2 block">Default Safe Words</label>
                                    <div className="flex gap-2">
                                        {['Stop', 'Pause', 'Break', 'End'].map((word) => (
                                            <span key={word} className="text-[10px] font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 uppercase">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white">Custom Safe Words</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add Custom Safe Word"
                                            className="flex-1 bg-[#0E1113] border border-white/10 rounded-lg py-3 px-4 text-gray-400 text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                        />
                                        <button className="px-6 py-3 bg-[#1A1D21] border border-white/10 rounded-lg text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white">Emergency Contact (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Add Emergency Contact"
                                        className="w-full bg-[#0E1113] border border-white/10 rounded-lg py-3 px-4 text-gray-400 text-sm focus:outline-none focus:border-[#8459E2] transition-colors"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Contact to notify in case of emergency or extended safe word usage
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Session Management */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Timer className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Session Management</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Set healthy limits for your interactions
                            </p>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium mb-1">Session Time Limits</div>
                                    <div className="text-xs text-gray-500">Set maximum duration for chat sessions</div>
                                </div>
                                <Toggle checked={false} />
                            </div>
                        </div>

                        {/* Data Processing Consent */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <FileKey className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Data Processing Consent</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Manage how your data is used to improve your experience
                            </p>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-white font-medium mb-1">Data Processing for AI Improvement</div>
                                    <div className="text-xs text-gray-500">Allow anonymized conversation data to improve AI responses</div>
                                </div>
                                <Toggle checked={false} />
                            </div>

                            <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-4">
                                <p className="text-[10px] text-[#10B981] leading-relaxed">
                                    <span className="font-bold">Your Rights:</span> You can withdraw consent at any time. All data processing follows GDPR guidelines and your personal information is never shared or sold to third parties.
                                </p>
                            </div>
                        </div>

                        {/* Emergency Actions */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                                <h3 className="text-lg font-bold text-white">Emergency Actions</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Quick options if you need immediate help or want to stop
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <button className="flex-1 py-3 rounded-lg bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-500/20">
                                    Stop all Interaction
                                </button>
                                <button className="flex-1 py-3 rounded-lg border border-white/10 bg-[#0E1113] text-gray-400 text-xs font-bold hover:bg-[#1A1D21] transition-colors">
                                    Contact Support
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center">
                                If you're in immediate danger, please contact local emergency services
                            </p>
                        </div>

                        {/* Settings & Privacy Info */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-[#35DDFE]" />
                                <h3 className="text-sm font-bold text-white">Settings & Privacy</h3>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-3">
                                Your settings are automatically saved and synced across devices. All changes take effect immediately. If you need help or have concerns, our support team is available 24/7.
                            </p>
                            <div className="flex gap-3">
                                <span className="text-[10px] text-gray-500 font-medium">Auto-Sync</span>
                                <span className="text-[10px] text-gray-500 font-medium">24/7 Support</span>
                                <span className="text-[10px] text-gray-500 font-medium">Secure</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatsCard
                        icon={<MessageCircle className="w-5 h-5 text-[#8459E2]" />}
                        value="127"
                        label="Messages"
                    />
                    <StatsCard
                        icon={<User className="w-5 h-5 text-[#35DDFE]" />}
                        value="23"
                        label="Days Active"
                    />
                    <StatsCard
                        icon={<BookOpen className="w-5 h-5 text-[#F59E0B]" />}
                        value="8"
                        label="Lessons"
                    />
                    <StatsCard
                        icon={<Heart className="w-5 h-5 text-[#EC4899]" />}
                        value="25%"
                        label="73%"
                        labelClass="text-gray-400"
                    />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon, value, label, labelClass = "text-gray-400" }: any) {
    return (
        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
            <div className="mb-3">
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className={`${labelClass} text-xs md:text-sm`}>{label}</div>
        </div>
    );
}

function Toggle({ checked, onClick, color = 'bg-[#8459E2]' }: any) {
    return (
        <div
            className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${checked ? color : 'bg-[#2A2D31]'}`}
            onClick={onClick}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm ${checked ? 'left-7' : 'left-1'}`} />
        </div>
    );
}
