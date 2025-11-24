import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scfpvjfnfrnovmijbglq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZnB2amZuZnJub3ZtaWpiZ2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODM0MjQsImV4cCI6MjA3NDE1OTQyNH0.YOIHeffVwVwZIwGhnrmtpfjCe2uxyvIYvrE0PH8UQak';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
