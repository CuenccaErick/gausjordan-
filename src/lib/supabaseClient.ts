// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Las llaves se leen de variables de entorno (archivo .env, no se sube al repo)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
