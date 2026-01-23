import { supabase } from '@/lib/supabase';
import { AIModel, UserProfile } from '@/types/ai';

export const aiService = {
    // Fetch all available AI models
    async getModels(): Promise<AIModel[]> {
        const { data, error } = await supabase
            .from('ai_models')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    // Get a specific model by ID
    async getModelById(id: string): Promise<AIModel | null> {
        const { data, error } = await supabase
            .from('ai_models')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Get user's profile including selected model
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // Update user's selected model
    async updateSelectedModel(userId: string, modelId: string): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .update({ selected_model_id: modelId, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) throw error;
    }
};
