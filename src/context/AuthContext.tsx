'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    profile: any | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState<any>(null);

    const lastUserIdRef = useRef<string | null>(null);

    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            // Prevent duplicate fetches for the same user within this mount
            if (lastUserIdRef.current === userId && profile) return;

            try {
                lastUserIdRef.current = userId;
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();
                if (data) setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        const initializeAuth = async () => {
            try {
                // Get initial session
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
                setUser(initialSession?.user ?? null);

                if (initialSession?.user) {
                    // Fetch in background so loading screen clears immediately
                    fetchProfile(initialSession.user.id);
                }
            } catch (error) {
                console.error('Error checking auth session:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                // Only update user if ID changes
                setUser(prevUser => {
                    if (session?.user?.id === prevUser?.id) return prevUser;
                    return session?.user ?? null;
                });

                if (session?.user) {
                    // Only fetch if it's a DIFFERENT user or we haven't fetched yet
                    if (session.user.id !== lastUserIdRef.current) {
                        fetchProfile(session.user.id);
                    }
                }

                if (_event === 'SIGNED_OUT') {
                    setUser(null);
                    setSession(null);
                    setProfile(null);
                    lastUserIdRef.current = null;
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
