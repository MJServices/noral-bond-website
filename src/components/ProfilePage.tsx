'use client';

import {
    User,
    MapPin,
    Calendar,
    Edit,
    Heart,
    Trophy,
    Activity,
    Sparkles,
    Zap,
    Brain,
    Shield,
    Star,
    Check,
    Crown,
    Repeat,
    ShieldOff,
    AlertTriangle,
    LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile Data
    const [profileData, setProfileData] = useState({
        full_name: 'Explorer',
        age: 0,
        location: 'Global',
        bio: 'Exploring meaningful connections...',
        member_since: new Date().toLocaleDateString(),
        conversations_count: 0,
        days_active: 0,
        level: 1,
        bond_score: 0
    });

    // Settings / Preferences
    const [selectedPersonality, setSelectedPersonality] = useState('caring-guardian');
    const [relationshipType, setRelationshipType] = useState('switch');
    const [safeMode, setSafeMode] = useState(true);
    const [coupleMode, setCoupleMode] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(profileData);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            setLoading(true);
            try {

                // 1. Fetch User Profile
                const { data: profileDataResponse, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user!.id)
                    .limit(1);

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                }

                const profile = profileDataResponse?.[0];

                if (profile) {
                    setProfileData({
                        full_name: profile.full_name || 'Explorer',
                        age: profile.age || 0,
                        location: profile.location || 'Global',
                        bio: profile.bio || 'Exploring meaningful connections...',
                        member_since: new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        conversations_count: profile.conversations_count || 0,
                        days_active: profile.days_active || 0,
                        level: profile.level || 1,
                        bond_score: profile.bond_score || 0
                    });
                }

                // 2. Fetch User Settings
                const { data: settingsResponse, error: settingsError } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user!.id)
                    .limit(1);

                if (settingsError) {
                    console.error('Error fetching settings:', settingsError);
                }

                const settings = settingsResponse?.[0];

                if (settings) {
                    setSelectedPersonality(settings.selected_personality_id || 'caring-guardian');
                    setRelationshipType(settings.preferred_role || settings.relationship_type || 'switch');
                    setSafeMode(settings.safe_mode ?? true);
                    setCoupleMode(settings.couple_mode ?? false);
                }
            } catch (error) {
                console.error('Unexpected error in fetchData:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user?.id]);

    useEffect(() => {
        setEditData(profileData);
    }, [profileData]);

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editData.full_name,
                    age: editData.age,
                    location: editData.location,
                    bio: editData.bio
                })
                .eq('id', user.id);

            if (error) throw error;

            // Update local state
            setProfileData({ ...profileData, ...editData });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            // Optionally add error toast here
        }
    };

    const handleCancelEdit = () => {
        setEditData(profileData); // Reset changes
        setIsEditing(false);
    };

    // Save Settings Helpers
    const updateSetting = async (column: string, value: any) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('user_settings')
                .update({ [column]: value })
                .eq('user_id', user.id);

            if (error) throw error;
        } catch (err) {
            console.error(`Error updating ${column}:`, err);
        }
    };

    // Handlers with auto-save
    const handlePersonalityChange = (id: string) => {
        setSelectedPersonality(id);
        updateSetting('selected_personality_id', id);
    };

    const handleRelationshipChange = (type: string) => {
        setRelationshipType(type);
        updateSetting('relationship_type', type);
    };

    const handleSafeModeChange = (val: boolean) => {
        setSafeMode(val);
        updateSetting('safe_mode', val);
    };

    const handleCoupleModeChange = (val: boolean) => {
        setCoupleMode(val);
        updateSetting('couple_mode', val);
    };

    const personalities = [
        {
            id: 'caring-guardian',
            name: 'Caring Guardian',
            icon: Heart,
            color: 'text-[#4ADE80]',
            bgColor: 'bg-[#4ADE80]/10',
            borderColor: 'border-[#4ADE80]/20',
            description: 'Nurturing, protective, and emotionally supportive. Perfect for emotional connection and comfort.',
            tags: ['Empathetic', 'Supportive', 'Gentle', 'Protective'],
            recommended: true
        },
        {
            id: 'playful-explorer',
            name: 'Playful Explorer',
            icon: Sparkles,
            color: 'text-[#C27AFF]',
            bgColor: 'bg-[#C27AFF]/10',
            borderColor: 'border-[#C27AFF]/20',
            description: 'Curious, energetic, and adventurous. Great for brainstorming ideas and exploring new topics.',
            tags: ['Creative', 'Fun', 'Curious', 'Spontaneous']
        },
        {
            id: 'wise-mentor',
            name: 'Wise Mentor',
            icon: Brain,
            color: 'text-[#60A5FA]',
            bgColor: 'bg-[#60A5FA]/10',
            borderColor: 'border-[#60A5FA]/20',
            description: 'Knowledgeable, patient, and insightful. Ideal for learning, advice, and deep conversations.',
            tags: ['Wise', 'Patient', 'Rational', 'Helpful']
        },
        {
            id: 'confident-leader',
            name: 'Confident Leader',
            icon: Star,
            color: 'text-[#F59E0B]',
            bgColor: 'bg-[#F59E0B]/10',
            borderColor: 'border-[#F59E0B]/20',
            description: 'Decisive, motivating, and goal-oriented. Perfect for productivity, coaching, and accountability.',
            tags: ['Bold', 'Inspiring', 'Direct', 'Ambitious']
        },
        {
            id: 'mysterious-enigma',
            name: 'Mysterious Enigma',
            icon: Zap,
            color: 'text-[#8B5CF6]',
            bgColor: 'bg-[#8B5CF6]/10',
            borderColor: 'border-[#8B5CF6]/20',
            description: 'Cryptic, intriguing, and unconventional. Best for puzzles, abstract thinking, and mystery.',
            tags: ['Mysterious', 'Deep', 'Complex', 'Unique']
        },
        {
            id: 'gentle-soul',
            name: 'Gentle Soul',
            icon: Shield,
            color: 'text-[#2DD4BF]',
            bgColor: 'bg-[#2DD4BF]/10',
            borderColor: 'border-[#2DD4BF]/20',
            description: 'Calm, peaceful, and non-judgmental. A safe haven for relaxation and quiet companionship.',
            tags: ['Calm', 'Peaceful', 'Kind', 'Soothing']
        }
    ];

    // ... (rest of logic)

    return (
        <div className="flex flex-col min-h-screen bg-[#0E1113] p-4 md:p-8 lg:p-12 overflow-y-auto relative">
            {/* Logout Button */}
            <button
                onClick={() => signOut()}
                className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 z-50"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6 md:mb-10">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#C27AFF] to-[#EC4899] bg-clip-text text-transparent mb-2 md:mb-3">
                    Your Profile
                </h1>
                <p className="text-gray-400">
                    Customize your AI companion experience and manage your preferences
                </p>
            </div>

            <div className="max-w-4xl mx-auto w-full space-y-8">
                {/* Navigation Tabs */}
                <div className="flex items-center justify-between bg-[#1A1D21] p-1 rounded-xl border border-white/5">
                    {['Profile', 'Personality', 'Preferences'].map((tab) => {
                        const id = tab.toLowerCase();
                        const isActive = activeTab === id;

                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 py-2 md:py-3 px-3 md:px-6 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isActive
                                    ? 'bg-[#1A1D21] border border-white/10 shadow-[0_0_20px_rgba(132,89,226,0.1)] text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    } relative`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#8459E2]/10 to-[#EC4899]/10 rounded-lg" />
                                )}
                                {/* Active Tab Indicator Line - Only for 'Profile' in the design, but let's make it consistent or specific */}
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-[#8459E2] to-[#EC4899]"></span>
                                )}

                                {id === 'profile' && <User className="w-4 h-4" />}
                                {id === 'personality' && <Heart className="w-4 h-4" />}
                                {id === 'preferences' && <SettingsIcon className="w-4 h-4" />}

                                <span className="relative z-10">{tab}</span>
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'profile' && (
                    <div className="max-w-4xl mx-auto w-full space-y-8">
                        {/* Profile Information Card */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-6 md:p-10 relative overflow-hidden group">
                            {/* Subtle background glow */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8459E2]/5 rounded-full blur-[100px] group-hover:bg-[#8459E2]/10 transition-all duration-500"></div>

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#2A2D31] hover:bg-[#343C40] rounded-lg text-gray-300 hover:text-white text-sm transition-colors border border-white/5"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8459E2] to-[#EC4899] hover:opacity-90 rounded-lg text-white text-sm transition-opacity border border-white/5"
                                            >
                                                <Check className="w-4 h-4" />
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#2A2D31] hover:bg-[#343C40] rounded-lg text-gray-300 hover:text-white text-sm transition-colors border border-white/5"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                {/* Avatar */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#C27AFF] to-[#EC4899] flex items-center justify-center shadow-lg shadow-purple-500/20 text-2xl md:text-3xl font-bold text-white">
                                    {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : 'A'}
                                </div>

                                <div className="flex-1 space-y-4 w-full">
                                    <div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.full_name}
                                                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                                className="text-xl md:text-2xl font-bold text-white mb-2 bg-transparent border-b border-white/20 focus:border-[#8459E2] focus:outline-none w-full md:w-1/2"
                                                placeholder="Your Name"
                                            />
                                        ) : (
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{profileData.full_name}</h3>
                                        )}

                                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                Age:
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editData.age}
                                                        onChange={(e) => setEditData({ ...editData, age: parseInt(e.target.value) || 0 })}
                                                        className="bg-transparent border-b border-white/20 focus:border-[#8459E2] focus:outline-none w-16 text-white ml-2"
                                                    />
                                                ) : (
                                                    <span className="ml-1">{profileData.age > 0 ? profileData.age : 'N/A'}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.location}
                                                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                                        className="bg-transparent border-b border-white/20 focus:border-[#8459E2] focus:outline-none w-32 text-white ml-2"
                                                        placeholder="Location"
                                                    />
                                                ) : (
                                                    <span className="ml-1">{profileData.location}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <textarea
                                            value={editData.bio}
                                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                            className="text-gray-400 leading-relaxed w-full bg-[#0E1113]/50 border border-white/10 rounded-lg p-3 focus:border-[#8459E2] focus:outline-none resize-none h-24"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    ) : (
                                        <p className="text-gray-400 leading-relaxed max-w-2xl">
                                            {profileData.bio}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <div className="px-4 py-1.5 rounded-full bg-[#8459E2]/10 border border-[#8459E2]/20 text-[#C27AFF] text-xs font-semibold">
                                            Member Since {profileData.member_since}
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80] text-xs font-semibold">
                                            Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={<Heart className="w-5 h-5 text-[#C27AFF]" />}
                                value={profileData.conversations_count.toString()}
                                label="Conversations"
                            />
                            <StatCard
                                icon={<Calendar className="w-5 h-5 text-[#C27AFF]" />}
                                value={profileData.days_active.toString()}
                                label="Days Active"
                            />
                            <StatCard
                                icon={<Trophy className="w-5 h-5 text-[#C27AFF]" />}
                                value={profileData.level.toString()}
                                label="Level"
                            />
                            <StatCard
                                icon={<Heart className="w-5 h-5 text-[#C27AFF]" />}
                                value={`${profileData.bond_score}%`}
                                label="Bond Score"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'personality' && (
                    <div className="max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Choose AI Personality</h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                Select the personality type that resonates with you. You can change this anytime.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {personalities.map((personality) => {
                                const isSelected = selectedPersonality === personality.id;
                                return (
                                    <button
                                        key={personality.id}
                                        onClick={() => handlePersonalityChange(personality.id)}
                                        className={`relative text-left p-6 rounded-xl border transition-all duration-200 group ${isSelected
                                            ? 'bg-[#1A1D21] border-[#8459E2] ring-1 ring-[#8459E2]'
                                            : 'bg-[#1A1D21]/50 border-white/5 hover:bg-[#1A1D21] hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-lg ${personality.bgColor} ${personality.color}`}>
                                                <personality.icon className="w-6 h-6" />
                                            </div>
                                            {isSelected ? (
                                                <div className="w-5 h-5 rounded-full bg-[#8459E2] border-[3px] border-[#0E1113] ring-1 ring-[#8459E2] flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-white/40"></div>
                                            )}
                                        </div>

                                        <div className="mb-1 flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-white">{personality.name}</h3>
                                            {personality.recommended && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#4ADE80]/20 text-[#4ADE80] uppercase tracking-wide">
                                                    Recommended
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                                            {personality.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {personality.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="bg-[#1A1D21] border border-white/5 rounded-lg p-4 text-center">
                            <p className="text-xs md:text-sm text-gray-500">
                                <span className="font-bold text-gray-400">Note:</span> Your AI companion's personality will adapt and evolve based on your interactions. This selection sets the initial foundation for your relationship.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="max-w-4xl mx-auto w-full space-y-8 animate-fade-in">

                        {/* Relationship Preferences */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Relationship Preferences</h2>
                                <p className="text-gray-400 text-sm">
                                    Configure how you'd like to interact with your AI companion. All settings are private and can be changed anytime.
                                </p>
                            </div>

                            <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-4 md:p-8">
                                <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#C27AFF]" />
                                    Preferred Dynamic
                                </h3>
                                <p className="text-gray-400 text-xs md:text-sm mb-6 -mt-4">
                                    Select your preferred relationship dynamic. This affects how your AI companion interacts with you.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DynamicOption
                                        id="dominant"
                                        label="Dominant"
                                        description="You prefer to take control and guide interactions"
                                        icon={<Crown className="w-5 h-5" />}
                                        color="text-[#EF4444]"
                                        selected={relationshipType === 'dominant'}
                                        onClick={handleRelationshipChange}
                                    />
                                    <DynamicOption
                                        id="submissive"
                                        label="Submissive"
                                        description="You prefer to take control and guide interactions"
                                        icon={<Heart className="w-5 h-5" />}
                                        color="text-[#EC4899]"
                                        selected={relationshipType === 'submissive'}
                                        onClick={handleRelationshipChange}
                                    />
                                    <DynamicOption
                                        id="switch"
                                        label="Switch"
                                        description="You prefer to take control and guide interactions"
                                        icon={<Repeat className="w-5 h-5" />}
                                        color="text-[#8B5CF6]"
                                        selected={relationshipType === 'switch'}
                                        onClick={handleRelationshipChange}
                                    />
                                    <DynamicOption
                                        id="na"
                                        label="Not Applicable"
                                        description="You prefer to take control and guide interactions"
                                        icon={<ShieldOff className="w-5 h-5" />}
                                        color="text-[#3B82F6]"
                                        selected={relationshipType === 'na'}
                                        onClick={handleRelationshipChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Safety & Privacy */}
                        <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-4 md:p-8">
                            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#4ADE80]" />
                                Safety & Privacy
                            </h3>
                            <p className="text-gray-400 text-xs md:text-sm mb-6">
                                Control your safety settings and privacy preferences.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Safe Mode</h4>
                                        <p className="text-xs text-gray-500">Restrict content to emotional support and general conversation</p>
                                    </div>
                                    <Toggle checked={safeMode} onChange={handleSafeModeChange} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Couple Mode</h4>
                                        <p className="text-xs text-gray-500">Enable shared AI assistant for couples</p>
                                    </div>
                                    <Toggle checked={coupleMode} onChange={handleCoupleModeChange} />
                                </div>
                            </div>
                        </div>

                        {/* Warning Footer */}
                        <div className="bg-[#451a03]/40 border border-[#F59E0B]/20 rounded-xl p-4 flex gap-3 items-start">
                            {/* <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" /> */}
                            {/* Screenshot doesn't show icon clearly, but yellow text. */}
                            <p className="text-xs md:text-sm text-[#F59E0B]">
                                <span className="font-bold">Important:</span> All interactions are consensual and can be stopped at any time. Use safe words like "stop" or "pause" to immediately halt any scenario.
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#1A1D21]/80 transition-colors group">
            <div className="mb-3 p-3 rounded-full bg-[#1A1D21] border border-white/5 group-hover:border-[#C27AFF]/30 transition-colors">
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</div>
        </div>
    );
}

function DynamicOption({ id, label, description, icon, color, selected, onClick }: any) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 relative group ${selected
                ? 'bg-[#1A1D21] border-[#8459E2] ring-1 ring-[#8459E2]'
                : 'bg-[#0E1113]/50 border-white/5 hover:bg-[#1A1D21] hover:border-white/10'
                }`}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className={`${selected ? color : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {icon}
                </div>
                <h4 className="font-bold text-white">{label}</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
                {description}
            </p>
            {selected && (
                <div className="absolute top-4 right-4 text-[#8459E2]">
                    <div className="w-2 h-2 rounded-full bg-[#8459E2] shadow-[0_0_8px_#8459E2]"></div>
                </div>
            )}
        </button>
    )
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-14 h-8 rounded-full transition-colors duration-200 ease-in-out relative flex-shrink-0 ${checked ? 'bg-[#8459E2]' : 'bg-[#2A2D31]'
                }`}
        >
            <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform duration-200 shadow-sm ${checked ? 'translate-x-[28px]' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}
