
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uqolnnpsjezrqkmtdqqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxb2xubnBzamV6cnFrbXRkcXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDkxMDksImV4cCI6MjA4ODM4NTEwOX0.gv0PD-KzmdrxSq5gE1hxbkIdWnUod_JdeMud261YTlc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
