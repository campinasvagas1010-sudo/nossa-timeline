-- ============================================
-- TABELA: payments
-- Registra pagamentos PIX para acesso premium
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  payment_id VARCHAR(100) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_email_status ON payments(email, status);

-- Comentários
COMMENT ON TABLE payments IS 'Registra pagamentos PIX para validação de acesso premium';
COMMENT ON COLUMN payments.email IS 'Email usado no pagamento (chave de acesso)';
COMMENT ON COLUMN payments.payment_id IS 'ID do pagamento no MercadoPago';
COMMENT ON COLUMN payments.status IS 'Status: pending, approved, rejected, cancelled';
