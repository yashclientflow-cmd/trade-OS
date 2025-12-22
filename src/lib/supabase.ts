import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Types helper for our specific schema
export type Tables = {
  trades: {
    id: string;
    user_id: string;
    pair: string;
    entry_price: number;
    stop_loss: number;
    take_profit: number;
    outcome: string;
    // ... other fields mapped dynamically
  };
  profiles: {
    id: string;
    email: string;
    trading_style: string;
  };
};
