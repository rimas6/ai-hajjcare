import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dwfjjkojofwzwjyutzbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Zmpqa29qb2Z3endqeXV0emJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODU2MTIsImV4cCI6MjA4NjE2MTYxMn0.btPztJJsxlr8nmu_oWX4MYKq3Ys_Po_ZhDyZyxmXJC0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});