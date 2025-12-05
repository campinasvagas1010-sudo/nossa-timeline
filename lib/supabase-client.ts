/**
 * Cliente Supabase configurado
 * 
 * Para configurar:
 * 1. Criar projeto em https://supabase.com
 * 2. Copiar URL e anon key
 * 3. Adicionar ao .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

import { createClient } from '@supabase/supabase-js';

// Validar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase não configurado. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ao .env.local');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Tipos do banco de dados
 */

export interface Story {
  id: string;
  slug: string;
  person1_name: string;
  person2_name: string;
  person1_photo?: string;
  person2_photo?: string;
  relationship_type: 'casal' | 'amizade';
  start_date: string;
  end_date: string;
  total_messages: number;
  battles: SupabaseBattleResult[];
  timeline?: TimelineEvent[];
  is_premium: boolean;
  created_at: string;
}

export interface SupabaseBattleResult {
  category: string;
  name: string;
  winner: string;
  confidence: number;
  result: string;
  evidence?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'neutral' | 'positive' | 'negative';
  messages?: string[];
}

/**
 * Gera slug único aleatório
 */
export function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return slug;
}

/**
 * Verifica se slug já existe
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('stories')
    .select('slug')
    .eq('slug', slug)
    .single();
  
  return !data && !error;
}

/**
 * Gera slug único (verificando disponibilidade)
 */
export async function generateUniqueSlug(): Promise<string> {
  let slug = generateSlug();
  let attempts = 0;
  
  while (attempts < 10) {
    const available = await isSlugAvailable(slug);
    if (available) return slug;
    
    slug = generateSlug();
    attempts++;
  }
  
  throw new Error('Não foi possível gerar slug único');
}

/**
 * Cria nova história no banco
 */
export async function createStory(data: Omit<Story, 'id' | 'created_at' | 'slug'>): Promise<Story> {
  const slug = await generateUniqueSlug();
  
  const { data: story, error } = await supabase
    .from('stories')
    .insert({
      ...data,
      slug,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[Supabase] Erro ao criar story:', error);
    throw new Error('Erro ao salvar história');
  }
  
  console.log(`[Supabase] ✅ Story criada: ${slug}`);
  
  return story;
}

/**
 * Busca história por slug
 */
export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('[Supabase] Erro ao buscar story:', error);
    return null;
  }
  
  return data;
}

/**
 * Atualiza história para premium
 */
export async function upgradeToPremium(slug: string): Promise<boolean> {
  const { error } = await supabase
    .from('stories')
    .update({ is_premium: true })
    .eq('slug', slug);
  
  if (error) {
    console.error('[Supabase] Erro ao fazer upgrade:', error);
    return false;
  }
  
  console.log(`[Supabase] ✅ Story ${slug} atualizada para premium`);
  
  return true;
}

/**
 * Upload de foto para Supabase Storage
 */
export async function uploadPhoto(file: File, slug: string, personNumber: 1 | 2): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${slug}_person${personNumber}.${fileExt}`;
  const filePath = `photos/${fileName}`;
  
  const { error } = await supabase.storage
    .from('stories')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });
  
  if (error) {
    console.error('[Supabase] Erro ao fazer upload:', error);
    return null;
  }
  
  // Obter URL pública
  const { data } = supabase.storage
    .from('stories')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
