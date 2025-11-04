import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhutqkvadxpjijsvoqgr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodXRxa3ZhZHhwamlqc3ZvcWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzE2NTQsImV4cCI6MjA3MzcwNzY1NH0.GtZDUUc71oi7axRp79q8fzCj-N4bdQl1cP0UZ8yBbAs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      project_templates: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          form_data: any;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          form_data: any;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          form_data?: any;
        };
      };
      project_submissions: {
        Row: {
          id: string;
          submitted_at: string;
          prompt_generated: string;
          prompt_text: string;
        };
        Insert: {
          id?: string;
          submitted_at?: string;
          prompt_generated: string;
          prompt_text: string;
        };
        Update: {
          id?: string;
          submitted_at?: string;
          prompt_generated?: string;
          prompt_text?: string;
        };
      };
    };
  };
};

