export interface AIModel {
    id: string;
    name: string;
    description: string;
    personality_prompt: string;
    bonding_multiplier: number;
    image_url?: string;
    created_at: string;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    selected_model_id?: string;
    updated_at?: string;
    // Stats & Bio
    age?: number;
    location?: string;
    bio?: string;
    member_since?: string;
    conversations_count?: number;
    days_active?: number;
    level?: number;
    bond_score?: number;
    last_active_at?: string;
}
