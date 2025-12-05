-- ============================================
-- MIGRATION: Adicionar suporte a pagamentos
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. Adicionar colunas de pagamento
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'approved', 'rejected', 'cancelled')),
ADD COLUMN IF NOT EXISTS payer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS payer_name VARCHAR(255);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_stories_payment_id ON stories(payment_id);
CREATE INDEX IF NOT EXISTS idx_stories_payment_status ON stories(payment_status);

-- 3. Comentários para documentação
COMMENT ON COLUMN stories.payment_id IS 'ID do pagamento no MercadoPago';
COMMENT ON COLUMN stories.payment_status IS 'Status do pagamento: pending, approved, rejected, cancelled';
COMMENT ON COLUMN stories.payer_email IS 'Email do comprador';
COMMENT ON COLUMN stories.payer_name IS 'Nome do comprador';
