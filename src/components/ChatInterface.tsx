'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Heart,
    Zap,
    Settings,
    Sparkles,
    Mic,
    Image as ImageIcon,
    Send,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
};

export default function ChatInterface() {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [bondScore, setBondScore] = useState(0);
    const [personality, setPersonality] = useState('Caring Guardian');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Personalities Map
    const personalities: Record<string, string> = {
        'caring-guardian': 'Caring Guardian',
        'playful-explorer': 'Playful Explorer',
        'wise-mentor': 'Wise Mentor',
        'confident-leader': 'Confident Leader',
        'mysterious-enigma': 'Mysterious Enigma',
        'gentle-soul': 'Gentle Soul'
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Fetch User Settings for Personality
            const { data: settingsData } = await supabase
                .from('user_settings')
                .select('selected_personality_id')
                .eq('user_id', user.id)
                .single();

            if (settingsData && settingsData.selected_personality_id) {
                const name = personalities[settingsData.selected_personality_id];
                if (name) setPersonality(name);
            }

            // Fetch Bond Score from Profiles
            const { data: profileData } = await supabase
                .from('profiles')
                .select('bond_score')
                .eq('id', user.id)
                .single();

            if (profileData) setBondScore(profileData.bond_score || 0);

            // Fetch Messages
            const { data: messagesData, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (messagesError) throw messagesError;

            if (messagesData) {
                setMessages(messagesData);
            } else {
                setMessages([{
                    id: 'initial',
                    role: 'assistant',
                    content: "Hello! I'm Maya, your AI companion. I'm here to listen, learn, and grow with you. How are you feeling today?",
                    created_at: new Date().toISOString()
                }]);
            }
        } catch (err: any) {
            console.error('Error loading chat:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        if (!user) return;

        // Real-time subscription for new messages and profile updates
        const channel = supabase
            .channel('chat_updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages(prev => {
                        // Avoid duplicates
                        if (prev.find(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    const newProfile = payload.new as any;
                    if (newProfile.bond_score !== undefined) {
                        setBondScore(newProfile.bond_score);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const handleSendMessage = async () => {
        if (!message.trim() || !user || isSending) return;

        setIsSending(true);
        const content = message.trim();
        setMessage(''); // Clear input immediately

        try {
            // 1. Insert User Message
            const { data: sentMessage, error: sendError } = await supabase
                .from('messages')
                .insert([
                    {
                        user_id: user.id,
                        content: content,
                        role: 'user'
                    }
                ])
                .select()
                .single();

            if (sendError) throw sendError;

            // Optimistically update UI
            if (sentMessage) {
                setMessages(prev => {
                    if (prev.find(m => m.id === sentMessage.id)) return prev;
                    return [...prev, sentMessage];
                });
            }

            // 2. Simulate AI Response
            setTimeout(async () => {
                const { data: replyMessage, error: replyError } = await supabase
                    .from('messages')
                    .insert([
                        {
                            user_id: user.id,
                            content: `I hear you. You said: "${content}". Tell me more about that?`,
                            role: 'assistant'
                        }
                    ])
                    .select()
                    .single();

                if (replyError) console.error('Error sending reply:', replyError);

                if (replyMessage) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === replyMessage.id)) return prev;
                        return [...prev, replyMessage];
                    });
                }
            }, 1000);

        } catch (error: any) {
            console.error('Error sending message:', JSON.stringify(error, null, 2));
            // Also log the error message property if it exists
            if (error?.message) console.error('Error message:', error.message);
            if (error?.details) console.error('Error details:', error.details);
            if (error?.hint) console.error('Error hint:', error.hint);
        } finally {
            setIsSending(false);
        }
    };

    const handleClearChat = async () => {
        if (!user) return;
        if (!confirm('Are you sure you want to clear the chat history?')) return;

        try {
            await supabase
                .from('messages')
                .delete()
                .eq('user_id', user.id);
            setMessages([]);
        } catch (error: any) {
            console.error('Error clearing chat:', JSON.stringify(error, null, 2));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0E1113] relative">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    {/* Profile Picture */}
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#8459E2] via-[#C27AFF] to-[#EC4899] flex items-center justify-center p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#0E1113] flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-[#C27AFF] to-[#EC4899] flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        {/* Online/Mood Indicator */}
                        <div className="absolute 
                            bottom-0 right-0 md:-bottom-0.5 md:-right-0.5 
                            w-3 h-3 md:w-3.5 md:h-3.5 
                            bg-[#4ADE80] rounded-full border-2 border-[#0E1113]">
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="text-white font-bold text-base md:text-lg">Maya</h2>
                            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#8459E2]/20 text-[#C27AFF] text-[10px] font-semibold border border-[#8459E2]/30 leading-none">
                                AI Companion
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                            <span className="text-gray-400">Mood:</span>
                            <span className="text-[#4ADE80] font-medium text-xs md:text-sm">{personality}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    {/* Bond Score */}
                    <div className="flex flex-col items-end mr-1 md:mr-2">
                        <div className="flex items-center gap-1.5 text-white/90">
                            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white/20" />
                            <span className="font-bold text-sm md:text-base">{bondScore}%</span>
                        </div>
                        <span className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">Bond</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-3">
                        <button className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Zap className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Settings className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 space-y-6 md:space-y-8 flex flex-col">
                {/* Privacy Notice */}
                <div className="bg-[#1A1D21] border border-white/5 rounded-xl p-4 flex gap-4 max-w-3xl mx-auto w-full">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#2A2D31] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#8459E2]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-1">Safe & Supportive Space</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            This is your private conversation with Maya. Everything you share is confidential. Feel free to express yourself authentically and explore your thoughts safely.
                        </p>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-4">
                    {messages.map((msg, index) => (
                        <div key={msg.id || index} className={`flex gap-4 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8459E2] via-[#C27AFF] to-[#EC4899] flex-shrink-0 flex items-center justify-center p-[1px]">
                                    <div className="w-full h-full rounded-full bg-[#E0E7FF] flex items-center justify-center text-sm">🤖</div>
                                </div>
                            )}

                            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-semibold text-sm">{msg.role === 'user' ? 'You' : 'Maya'}</span>
                                    <span className="text-gray-500 text-xs">
                                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <div className={`${msg.role === 'user'
                                    ? 'bg-[#8459E2]/20 border border-[#8459E2]/20 text-white'
                                    : 'bg-[#1A1D21] border border-white/5 text-gray-300'} 
                                    p-4 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} leading-relaxed shadow-sm`}>
                                    {msg.content}
                                </div>
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-[#2A2D31] flex-shrink-0 flex items-center justify-center text-sm border border-white/10">
                                    You
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Warning Bar */}
            <div className="bg-[#F59E0B]/10 border-y border-[#F59E0B]/20 py-2.5 px-4 md:px-8 flex items-center justify-between">
                <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                    <button
                        onClick={handleClearChat}
                        className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Clear Chat
                    </button>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-8 pt-6 pb-8 bg-[#0E1113]">
                <div className="max-w-3xl mx-auto w-full space-y-4">
                    <div className="relative flex items-center gap-4">
                        <div className="flex items-center gap-3 text-gray-400">
                            <button className="hover:text-white transition-colors">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button className="hover:text-white transition-colors">
                                <ImageIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Share your thoughts..."
                                disabled={isSending}
                                className="w-full bg-[#1A1D21] border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#8459E2]/50 focus:ring-1 focus:ring-[#8459E2]/50 transition-all pr-10 md:pr-12 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isSending}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-[#8459E2] to-[#EC4899] rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>

                        <button className="text-gray-400 hover:text-white transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 md:gap-2.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button className="whitespace-nowrap px-3 md:px-4 py-2 bg-[#1A1D21] border border-white/5 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors">
                            How are you feeling?
                        </button>
                        <button className="whitespace-nowrap px-3 md:px-4 py-2 bg-[#1A1D21] border border-white/5 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors">
                            Tell me about your day
                        </button>
                        <button className="whitespace-nowrap px-3 md:px-4 py-2 bg-[#1A1D21] border border-white/5 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors">
                            Let's explore together
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
