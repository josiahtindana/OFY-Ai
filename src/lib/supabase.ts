import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supgtfcsrtnxtsfzkobe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cGd0ZmNzcnRueHRzZnprb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjkyMjYsImV4cCI6MjA4ODY0NTIyNn0.AYmiFkWEQCUNVykIoWdV9qXElaVRUlN9AAldmm6RzzY';

export const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_fItvObM0M20kUYZP5O74uw_KwUPWu8n';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
