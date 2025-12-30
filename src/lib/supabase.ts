import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isMissingCredentials = !supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here'

if (isMissingCredentials) {
    console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

// Create Supabase client only if credentials are available
export const supabase: SupabaseClient | null = isMissingCredentials 
    ? null 
    : createClient(supabaseUrl, supabaseAnonKey)

// Export config for debugging
export const supabaseConfig = {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here',
    isConfigured: !isMissingCredentials
}
