// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Loaded ✓' : 'Missing ✗');
console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'Loaded ✓' : 'Missing ✗');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key (for admin operations)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anon key (for public operations)
export const supabaseAnon = createClient(
  supabaseUrl, 
  supabaseAnonKey
);

console.log('Supabase client initialized');