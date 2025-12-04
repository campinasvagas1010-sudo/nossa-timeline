-- ============================================
-- NOSSA TIMELINE - Schema do Supabase
-- ============================================
-- Execute este SQL no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- 1. Criar tabela de histórias
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(8) UNIQUE NOT NULL,
  
  -- Informações dos participantes
  person1_name VARCHAR(100) NOT NULL,
  person2_name VARCHAR(100) NOT NULL,
  person1_photo TEXT,
  person2_photo TEXT,
  
  -- Tipo de relacionamento
  relationship_type VARCHAR(20) NOT NULL CHECK (relationship_type IN ('casal', 'amizade')),
  
  -- Período da conversa
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_messages INTEGER NOT NULL,
  
  -- Dados da análise
  battles JSONB NOT NULL DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  
  -- Premium
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_is_premium ON stories(is_premium);

-- 3. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- 6. Criar política de leitura pública (qualquer um pode ler)
CREATE POLICY "Histórias são públicas para leitura"
  ON stories
  FOR SELECT
  USING (true);

-- 7. Criar política de inserção (qualquer um pode criar)
CREATE POLICY "Qualquer um pode criar história"
  ON stories
  FOR INSERT
  WITH CHECK (true);

-- 8. Criar política de atualização (apenas para upgrade premium)
CREATE POLICY "Qualquer um pode fazer upgrade"
  ON stories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET PARA FOTOS
-- ============================================
-- Execute no Storage > Create a new bucket
-- Nome: "stories"
-- Public: YES (para URLs públicas)
-- ============================================

-- Criar política de storage para upload (caso não exista)
INSERT INTO storage.buckets (id, name, public)
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir upload de imagens
CREATE POLICY "Qualquer um pode fazer upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'stories');

-- Permitir leitura pública
CREATE POLICY "Fotos são públicas"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'stories');

-- ============================================
-- TABELA DE PAGAMENTOS (OPCIONAL - PARA TRACKING)
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug VARCHAR(8) NOT NULL,
  
  -- Dados do Asaas
  asaas_payment_id TEXT UNIQUE,
  asaas_invoice_url TEXT,
  
  -- Status do pagamento
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  
  -- Valor
  amount DECIMAL(10, 2) DEFAULT 9.90,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Informações adicionais
  customer_email VARCHAR(255),
  customer_name VARCHAR(255)
);

-- Índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_story_id ON payments(story_id);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_payment_id ON payments(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- RLS para payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pagamentos são privados"
  ON payments
  FOR SELECT
  USING (false); -- Apenas backend pode acessar

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute estas queries para verificar:

-- Ver todas as tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver políticas RLS
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Ver storage buckets
SELECT * FROM storage.buckets;

-- ============================================
-- EXEMPLO DE USO
-- ============================================

-- Inserir história de teste
INSERT INTO stories (
  slug,
  person1_name,
  person2_name,
  relationship_type,
  start_date,
  end_date,
  total_messages,
  battles,
  is_premium
) VALUES (
  'test1234',
  'Ana',
  'Pedro',
  'casal',
  '2024-01-01',
  '2024-12-01',
  1500,
  '[
    {
      "category": "ciume",
      "name": "Mais Ciumento(a)",
      "winner": "Ana",
      "confidence": 68,
      "result": "Ana demonstrou mais ciúmes na conversa"
    }
  ]'::jsonb,
  false
);

-- Buscar história por slug
SELECT * FROM stories WHERE slug = 'test1234';

-- Fazer upgrade para premium
UPDATE stories SET is_premium = true WHERE slug = 'test1234';

-- Deletar história de teste
DELETE FROM stories WHERE slug = 'test1234';
