import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente público (usa RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin (bypassa RLS) - usar apenas em server-side
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

// Types para o banco de dados
export type Story = {
  id: string;
  slug: string;
  person1_name: string;
  person2_name: string;
  person1_photo: string | null;
  person2_photo: string | null;
  relationship_type: 'casal' | 'amizade';
  start_date: string;
  end_date: string;
  total_messages: number;
  cards: Card[];
  moments: Moment[];
  conversation_text: string | null;
  is_premium: boolean;
  payment_pending: boolean;
  full_timeline_generated: boolean;
  preview_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Card = {
  id: string;
  title: string;
  winner: string;
  stat: string;
  statLabel: string;
  confidence: number;
};

export type Moment = {
  title: string;
  emoji: string;
  category: string;
  description: string;
  snippet: string;
};

export type Payment = {
  id: string;
  story_id: string;
  slug: string;
  asaas_payment_id: string | null;
  asaas_invoice_url: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  amount: number;
  customer_email: string | null;
  customer_name: string | null;
  customer_cpf: string | null;
  customer_phone: string | null;
  created_at: string;
  paid_at: string | null;
};

// Helper para gerar slug único
export function generateSlug(): string {
  return Math.random().toString(36).substring(2, 10);
}
