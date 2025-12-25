import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onkodmftwqhabxdxypth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ua29kbWZ0d3FoYWJ4ZHh5cHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NTgwMjYsImV4cCI6MjA4MjEzNDAyNn0.ggpO3x3I5rjOU1_k7uGSjNuYJTcpGPM2wQ-NJ3uCBLU';

export const supabase = createClient(supabaseUrl, supabaseKey);