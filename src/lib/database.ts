import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zgvtqpxmtyjisfzzchpy.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndnRxcHhtdHlqaXNmenpjaHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNTQ5NzgsImV4cCI6MjA4MjkzMDk3OH0.Zaq1wnQCARQk91AogyhTaML1gCzUAlJgWad0qZURVlI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
