import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not defined in .env file')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not properly configured in .env file')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export config for debugging
export const supabaseConfig = {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here'
}
