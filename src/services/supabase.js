
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = "https://vscaoucmqdukbaltofxe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzY2FvdWNtcWR1a2JhbHRvZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzM3MzQsImV4cCI6MjA2MDc0OTczNH0.vQtWzcj7nf19IRt-hptEV7N_F9gJHgXEJG6HdKnimKk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;