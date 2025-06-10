import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveEligibilityResult(section: string, additionalInfo?: any) {
  const { data, error } = await supabase
    .from('eligibility_results')
    .insert([
      {
        eligible_section: section,
        additional_info: additionalInfo || null,
      }
    ]);
  if (error) {
    console.error('Error saving eligibility result:', error);
  }
  return data;
} 