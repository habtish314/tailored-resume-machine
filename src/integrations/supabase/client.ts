
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://knconqoinrqxnfpczham.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuY29ucW9pbnJxeG5mcGN6aGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTM3ODgsImV4cCI6MjA1ODk4OTc4OH0.GJlYeZ795qrjnRKyJKXxbp2YbylSbLTJSOLFazM2UbA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
