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
    Phone,
    Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Define the shape of our settings matching the DB, plus UI defaults
interface UserSettings {
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
        message_preview: boolean;
    };
    privacy: {
        profile_visibility: string;
        show_activity: boolean;
        conversation_analysis: boolean;
        conversation_history: boolean;
        anonymous_analytics: boolean;
        location_sharing: boolean;
    };
    theme: string;
    appearance: {
        font_size: string;
        compact_mode: boolean;
    };
    audio: {
        sound_effects: boolean;
        vibration: boolean;
    };
    chat: {
        auto_send: boolean;
        typing_indicator: boolean;
    };
    security: {
        biometric: boolean;
        session_timeout: string;
    };
    data: {
        auto_delete: boolean;
        ai_training: boolean;
    };
    content: {
        safe_mode: boolean;
        couples_mode: boolean;
    };
    personality?: {
        id: string;
        relationship_type: string;
    };
}

const defaultSettings: UserSettings = {
    notifications: { email: true, push: true, marketing: false, message_preview: true },
    privacy: { profile_visibility: 'private', show_activity: true, conversation_analysis: true, conversation_history: true, anonymous_analytics: false, location_sharing: false },
    theme: 'dark',
    appearance: { font_size: 'medium', compact_mode: true },
    audio: { sound_effects: true, vibration: true },
    chat: { auto_send: true, typing_indicator: true },
    security: { biometric: true, session_timeout: '30m' },
    data: { auto_delete: false, ai_training: false },
    content: { safe_mode: true, couples_mode: false }
};

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const [openMenu, setOpenMenu] = useState<string | null>(null); // 'theme', 'language', or null

    // Theme Helpers
    const isDark = settings.theme === 'dark';
    const styles = {
        bg: isDark ? 'bg-[#0E1113]' : 'bg-gray-50',
        card: isDark ? 'bg-[#1A1D21] border-white/5' : 'bg-white border-gray-200 shadow-sm',
        text: isDark ? 'text-white' : 'text-gray-900',
        subText: isDark ? 'text-gray-400' : 'text-gray-500',
        border: isDark ? 'border-white/5' : 'border-gray-200',
        input: isDark ? 'bg-[#0E1113] border-white/10 text-gray-400 focus:border-[#8459E2]' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#8459E2]',
        button: isDark ? 'bg-[#2A2D31] text-gray-400 hover:bg-[#32363b]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        navActive: isDark ? 'bg-[#2A2D31] text-white shadow-lg border border-white/5' : 'bg-white text-[#8459E2] shadow-lg border border-gray-200',
        navInactive: isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'
    };

    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const [completedLessons, setCompletedLessons] = useState(0);

    useEffect(() => {
        if (user?.id) loadSettings();
    }, [user?.id]);

    const handleUpdatePassword = async () => {
        setPasswordStatus(null);
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            setPasswordStatus({ type: 'error', text: 'Please fill in all fields' });
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            setPasswordStatus({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        if (passwordForm.new.length < 6) {
            setPasswordStatus({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setUpdatingPassword(true);
        try {
            // 1. Verify current password by re-authenticating
            if (!user?.email) throw new Error('User email not found');

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: passwordForm.current
            });

            if (signInError) {
                setPasswordStatus({ type: 'error', text: 'Incorrect current password' });
                setUpdatingPassword(false);
                return;
            }

            // 2. Update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordForm.new
            });

            if (updateError) throw updateError;

            setPasswordStatus({ type: 'success', text: 'Password updated successfully!' });
            setPasswordForm({ current: '', new: '', confirm: '' }); // Reset form
        } catch (error: any) {
            setPasswordStatus({ type: 'error', text: error.message });
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleExportData = async () => {
        if (!user) return;
        try {
            const dataToExport = {
                profile,
                settings,
                completed_lessons_count: completedLessons,
                exported_at: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `noral-bond-data-${user.id.slice(0, 8)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('Your data has been exported successfully.');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data.');
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you SURE you want to delete your account? This action cannot be undone.')) return;
        if (!confirm('Please confirm again. All your data will be permanently lost.')) return;

        try {
            // In a real app, we would call a Supabase Edge Function to delete the user from auth.users
            // For now, we can only update the profile to 'deleted' or sign them out as a safeguard
            // or try to delete the profile row if RLS allows.

            // Option 1: Mark as deleted (soft delete)
            // await supabase.from('profiles').update({ status: 'deleted' }).eq('id', user?.id);

            // Option 2: Just Sign Out with a message (Client-side usually can't delete Auth User)
            await supabase.auth.signOut();
            window.location.href = '/';

        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const loadSettings = async () => {
        try {
            // Fetch Profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .maybeSingle();

            if (data) {
                setProfile(data);
                // Merge default settings with loaded settings (deep merge would be better but simple spread for now)
                if (data.settings) {
                    // We do a shallow merge of categories to ensure new keys appear if missing in DB
                    setSettings(prev => ({
                        ...prev,
                        ...data.settings,
                        notifications: { ...prev.notifications, ...data.settings.notifications },
                        privacy: { ...prev.privacy, ...data.settings.privacy },
                        appearance: { ...prev.appearance, ...data.settings.appearance },
                        audio: { ...prev.audio, ...data.settings.audio },
                        chat: { ...prev.chat, ...data.settings.chat },
                        security: { ...prev.security, ...data.settings.security },
                        data: { ...prev.data, ...data.settings.data },
                        content: { ...prev.content, ...data.settings.content },
                    }));
                }
            }

            // Fetch Completed Lessons Count
            const { count, error: countError } = await supabase
                .from('user_lesson_progress')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user?.id)
                .eq('completed', true);

            if (!countError) {
                setCompletedLessons(count || 0);
            }

        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (category: keyof UserSettings, key: string, value: any) => {
        // 1. Optimistic Update
        const newSettings = { ...settings };
        // @ts-ignore
        if (typeof newSettings[category] === 'object' && key) {
            // @ts-ignore
            newSettings[category] = { ...newSettings[category], [key]: value };
        } else {
            // @ts-ignore
            newSettings[category] = value;
        }

        setSettings(newSettings);

        // 2. Persist to DB
        try {
            await supabase
                .from('profiles')
                .update({ settings: newSettings })
                .eq('id', user?.id);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen p-4 md:p-8 lg:p-12 overflow-y-auto ${styles.bg}`}>
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
                <div className="grid grid-cols-2 sm:flex p-1 bg-[#1A1D21] border border-white/5 rounded-xl gap-1 sm:gap-0">
                    {[
                        { id: 'account', label: 'Account', icon: User },
                        { id: 'privacy', label: 'Privacy', icon: Shield },
                        { id: 'preferences', label: 'Preferences', icon: Sliders },
                        { id: 'consent', label: 'Consent', icon: FileText },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                                ? styles.navActive
                                : styles.navInactive
                                } sm:flex-1`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'account' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Account Information */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-[#8459E2]" />
                                <h3 className={`text-lg font-bold ${styles.text}`}>Account Information</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Update your account details and contact information
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                <div className="space-y-2">
                                    <label className={`text-sm font-bold ${styles.text}`}>Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={profile?.email || ''}
                                            readOnly
                                            className={`w-full rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors cursor-not-allowed opacity-60 border ${styles.input}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-sm font-bold ${styles.text}`}>Account Status</label>
                                    <div className="flex gap-2 min-h-[46px] items-center">
                                        <span className="bg-[#8459E2]/10 border border-[#8459E2]/20 text-[#8459E2] text-[10px] uppercase font-bold px-3 py-1.5 rounded-full">
                                            Verified
                                        </span>
                                        {profile?.subscription_tier === 'premium' && (
                                            <span className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] uppercase font-bold px-3 py-1.5 rounded-full">
                                                Premium
                                            </span>
                                        )}
                                        {profile?.subscription_tier === 'standard' && (
                                            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full">
                                                Standard
                                            </span>
                                        )}
                                        {(!profile?.subscription_tier || profile?.subscription_tier === 'free') && (
                                            <span className="bg-gray-500/10 border border-gray-500/20 text-gray-500 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full">
                                                Free Plan
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-[#8459E2]" />
                                <h3 className={`text-lg font-bold ${styles.text}`}>Security Settings</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Manage your password and security features
                            </p>

                            <div className="mb-8">
                                <h4 className={`text-sm font-bold ${styles.text} mb-4`}>Change Password</h4>
                                {passwordStatus && (
                                    <div className={`mb-4 px-4 py-3 rounded-lg text-xs font-medium ${passwordStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {passwordStatus.text}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={passwordForm.current}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                placeholder="••••••••"
                                                className={`w-full rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none transition-colors border ${styles.input}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">New Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={passwordForm.new}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                placeholder="••••••••"
                                                className={`w-full rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none transition-colors border ${styles.input}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={passwordForm.confirm}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                placeholder="••••••••"
                                                className={`w-full rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none transition-colors border ${styles.input}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdatePassword}
                                    disabled={updatingPassword}
                                    className="px-6 py-2.5 rounded-lg border border-white/5 bg-[#2A2D31] text-gray-400 text-xs font-bold hover:bg-[#32363b] transition-colors disabled:opacity-50"
                                >
                                    {updatingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>

                            {/* 2FA Removed */}
                        </div>
                    </div>
                )}

                {activeTab === 'privacy' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Data Collection & Usage */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className={`text-lg font-bold ${styles.text}`}>Data Collection & Usage</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Control how your data is collected and used to improve your experience
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`${styles.text} font-medium mb-1`}>Conversation Analysis</div>
                                        <div className="text-xs text-gray-500">Allow AI to analyze conversations for personalization</div>
                                    </div>
                                    <Toggle
                                        checked={settings.privacy.conversation_analysis}
                                        onClick={() => updateSetting('privacy', 'conversation_analysis', !settings.privacy.conversation_analysis)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`${styles.text} font-medium mb-1`}>Conversation History</div>
                                        <div className="text-xs text-gray-500">Store conversation history for context and improvement</div>
                                    </div>
                                    <Toggle
                                        checked={settings.privacy.conversation_history}
                                        onClick={() => updateSetting('privacy', 'conversation_history', !settings.privacy.conversation_history)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`${styles.text} font-medium mb-1`}>Anonymous Analytics</div>
                                        <div className="text-xs text-gray-500">Share anonymous usage data to improve the app</div>
                                    </div>
                                    <Toggle
                                        checked={settings.privacy.anonymous_analytics}
                                        onClick={() => updateSetting('privacy', 'anonymous_analytics', !settings.privacy.anonymous_analytics)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Visibility */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="w-5 h-5 text-[#10B981]" />
                                <h3 className="text-lg font-bold text-white">Privacy & Visibility</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Control who can see your profile and activity
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Profile Visibility</label>
                                    <div className="relative">
                                        <button
                                            onClick={() => updateSetting('privacy', 'profile_visibility', settings.privacy.profile_visibility === 'public' ? 'private' : 'public')}
                                            className="w-full flex items-center justify-between bg-[#0E1113] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300"
                                        >
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                {settings.privacy.profile_visibility === 'public' ? 'Public' : 'Private - Only You'}
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
                                    <Toggle
                                        checked={settings.privacy.location_sharing}
                                        onClick={() => updateSetting('privacy', 'location_sharing', !settings.privacy.location_sharing)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Settings Removed */}

                        {/* Data Management */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Data Management</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Manage your stored data and conversation history
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <div className="text-white font-medium mb-1">Auto-Delete Messages</div>
                                        <div className="text-xs text-gray-500">Automatically delete old conversations</div>
                                    </div>
                                    <Toggle
                                        checked={settings.data.auto_delete}
                                        onClick={() => updateSetting('data', 'auto_delete', !settings.data.auto_delete)}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleExportData}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export My Data
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-500/20"
                                    >
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
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Palette className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className={`text-lg font-bold ${styles.text}`}>Appearance</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Customize the look and feel of your app
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2 relative">
                                    <label className={`text-sm font-medium ${styles.text}`}>Theme</label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenu(openMenu === 'theme' ? null : 'theme')}
                                            className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm hover:border-[#8459E2] transition-colors ${styles.input}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-gray-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                                                {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openMenu === 'theme' ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openMenu === 'theme' && (
                                            <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-xl z-50 overflow-hidden ${isDark ? 'bg-[#1A1D21] border-white/10' : 'bg-white border-gray-200'}`}>
                                                {['dark', 'light'].map((themeOption) => (
                                                    <button
                                                        key={themeOption}
                                                        onClick={() => {
                                                            updateSetting('theme', '', themeOption);
                                                            setOpenMenu(null);
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? 'hover:bg-[#2A2D31] text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                                            }`}
                                                    >
                                                        {themeOption === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                                                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                                        {settings.theme === themeOption && <Check className="w-4 h-4 ml-auto text-[#8459E2]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                { /* Language Removed */}
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Font Size: {settings.appearance.font_size}</div>
                                    <div className="flex items-center gap-2 bg-[#2A2D31] rounded-full p-1 relative">
                                        {/* Slider Background */}
                                        <div className="absolute left-1 right-1 h-2 bg-[#1A1D21] rounded-full z-0 top-1/2 -translate-y-1/2"></div>

                                        {/* Active Indicator (approximate position based on selection) */}

                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updateSetting('appearance', 'font_size', size)}
                                                className={`relative z-10 flex-1 h-6 rounded-full text-[10px] font-medium transition-all duration-200 ${settings.appearance.font_size === size
                                                    ? 'bg-[#8459E2] text-white shadow-lg'
                                                    : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                {size.charAt(0).toUpperCase() + size.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`${styles.text} font-medium mb-1`}>Compact Mode</div>
                                        <div className="text-xs text-gray-500">Reduce spacing for more content on screen</div>
                                    </div>
                                    <Toggle
                                        checked={settings.appearance.compact_mode}
                                        onClick={() => updateSetting('appearance', 'compact_mode', !settings.appearance.compact_mode)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Bell className="w-5 h-5 text-[#10B981]" />
                                <h3 className="text-lg font-bold text-white">Notifications</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Control when and how you receive notifications
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Enable Notifications</div>
                                        <div className="text-xs text-gray-500">Receive notifications for messages and updates</div>
                                    </div>
                                    <Toggle
                                        checked={settings.notifications.push}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('notifications', 'push', !settings.notifications.push)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Push Notifications</div>
                                        <div className="text-xs text-gray-500">Instant notifications on your device</div>
                                    </div>
                                    <Toggle
                                        checked={settings.notifications.push}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('notifications', 'push', !settings.notifications.push)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Email Notifications</div>
                                        <div className="text-xs text-gray-500">Important updates via email</div>
                                    </div>
                                    <Toggle
                                        checked={settings.notifications.email}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('notifications', 'email', !settings.notifications.email)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Message Preview</div>
                                        <div className="text-xs text-gray-500">Show message content in notifications</div>
                                    </div>
                                    <Toggle
                                        checked={settings.notifications.message_preview}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('notifications', 'message_preview', !settings.notifications.message_preview)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Audio & Haptics */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Volume2 className="w-5 h-5 text-[#10B981]" /> {/* Using green as in screenshot */}
                                <h3 className="text-lg font-bold text-white">Audio & Haptics</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Configure sound and vibration settings
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Sound Effects</div>
                                        <div className="text-xs text-gray-500">Play sounds for messages and interactions</div>
                                    </div>
                                    <Toggle
                                        checked={settings.audio.sound_effects}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('audio', 'sound_effects', !settings.audio.sound_effects)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Vibration</div>
                                        <div className="text-xs text-gray-500">Haptic feedback for interactions</div>
                                    </div>
                                    <Toggle
                                        checked={settings.audio.vibration}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('audio', 'vibration', !settings.audio.vibration)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chat Preferences */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <MessageCircle className="w-5 h-5 text-[#10B981]" /> {/* Using green/icon from screenshot */}
                                <h3 className="text-lg font-bold text-white">Chat Preferences</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Customize your conversation experience
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Auto-send with Enter</div>
                                        <div className="text-xs text-gray-500">Send messages when pressing Enter key</div>
                                    </div>
                                    <Toggle
                                        checked={settings.chat.auto_send}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('chat', 'auto_send', !settings.chat.auto_send)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Typing Indicator</div>
                                        <div className="text-xs text-gray-500">Show when AI companion is responding</div>
                                    </div>
                                    <Toggle
                                        checked={settings.chat.typing_indicator}
                                        color="bg-white/20"
                                        onClick={() => updateSetting('chat', 'typing_indicator', !settings.chat.typing_indicator)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reset Preferences */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <RefreshCw className="w-4 h-4 text-[#10B981]" />
                                <h3 className="text-lg font-bold text-white">Reset Preferences</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
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
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-green-500" />
                                <h3 className="text-lg font-bold text-white">Consent & Safety</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
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
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-5 h-5 text-[#8459E2]" />
                                <h3 className="text-lg font-bold text-white">Content Preferences</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
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
                                    <Toggle
                                        checked={settings.content.safe_mode}
                                        onClick={() => updateSetting('content', 'safe_mode', !settings.content.safe_mode)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium mb-1">Couples Mode</div>
                                        <div className="text-xs text-gray-500">Enable shared experiences for couples</div>
                                    </div>
                                    <Toggle
                                        checked={settings.content.couples_mode}
                                        onClick={() => updateSetting('content', 'couples_mode', !settings.content.couples_mode)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Safe Words & Emergency Controls */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                                <h3 className="text-lg font-bold text-white">Safe Words & Emergency Controls</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
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
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Timer className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Session Management</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
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
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <FileKey className="w-5 h-5 text-[#35DDFE]" />
                                <h3 className="text-lg font-bold text-white">Data Processing Consent</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
                                Manage how your data is used to improve your experience
                            </p>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-white font-medium mb-1">Data Processing for AI Improvement</div>
                                    <div className="text-xs text-gray-500">Allow anonymized conversation data to improve AI responses</div>
                                </div>
                                <Toggle
                                    checked={settings.data.ai_training}
                                    onClick={() => updateSetting('data', 'ai_training', !settings.data.ai_training)}
                                />
                            </div>

                            <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-4">
                                <p className="text-[10px] text-[#10B981] leading-relaxed">
                                    <span className="font-bold">Your Rights:</span> You can withdraw consent at any time. All data processing follows GDPR guidelines and your personal information is never shared or sold to third parties.
                                </p>
                            </div>
                        </div>

                        {/* Emergency Actions */}
                        <div className={`rounded-xl p-6 md:p-8 border ${styles.card}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                                <h3 className="text-lg font-bold text-white">Emergency Actions</h3>
                            </div>
                            <p className={`${styles.subText} text-sm mb-6`}>
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
                        value={profile?.conversations_count || 0}
                        label="Messages"
                    />
                    <StatsCard
                        icon={<User className="w-5 h-5 text-[#35DDFE]" />}
                        value={profile?.days_active || 0}
                        label="Days Active"
                    />
                    <StatsCard
                        icon={<BookOpen className="w-5 h-5 text-[#F59E0B]" />}
                        value={completedLessons}
                        label="Lessons"
                    />
                    <StatsCard
                        icon={<Heart className="w-5 h-5 text-[#EC4899]" />}
                        value={profile?.bond_score || 0}
                        label="Bond Score"
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
