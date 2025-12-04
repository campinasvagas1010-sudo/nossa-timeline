# Configuração do Sistema Premium

## 1. Configuração do Supabase

### Criar Tabelas

Execute os seguintes comandos SQL no SQL Editor do Supabase:

```sql
-- Adicionar colunas na tabela stories (se já existe)
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS cards JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS moments JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS conversation_text TEXT,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_pending BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS full_timeline_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preview_id VARCHAR(50);

-- Criar tabela de pagamentos (se não existe)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  story_id UUID REFERENCES stories(id),
  asaas_payment_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  pix_qr_code TEXT,
  pix_copy_paste TEXT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_cpf VARCHAR(14),
  customer_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_preview_id ON stories(preview_id);
CREATE INDEX IF NOT EXISTS idx_stories_is_premium ON stories(is_premium);
CREATE INDEX IF NOT EXISTS idx_payments_slug ON payments(slug);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_payment_id ON payments(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
```

### Configurar RLS (Row Level Security)

```sql
-- Permitir leitura pública de stories premium
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read premium stories" 
ON stories FOR SELECT 
USING (is_premium = true);

-- Permitir leitura de pagamentos pelo slug
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read payments by slug" 
ON payments FOR SELECT 
USING (true);
```

## 2. Configuração das Variáveis de Ambiente

Copie o arquivo `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

### Obter Supabase Anon Key:
1. Acesse: https://supabase.com/dashboard/project/icobpmuaurvtlhxvfump/settings/api
2. Copie o valor de "anon public"
3. Cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Obter Asaas API Key:
1. Acesse: https://www.asaas.com/api/apiKey/new
2. Para desenvolvimento, use o ambiente **Sandbox**
3. Copie a chave e cole em `ASAAS_API_KEY`
4. Mantenha `ASAAS_ENV=sandbox` durante os testes

## 3. Fluxo do Sistema Premium

### Preview (Grátis)
1. Usuário faz upload do arquivo no `/criar`
2. Sistema gera 4 momentos + cards (preview)
3. Mostra botão "Desbloquear Premium"

### Pagamento
1. Usuário clica em "Desbloquear Premium" (R$ 9,90)
2. Preenche dados no `PaymentModal` (nome, email, cpf, telefone)
3. Sistema cria pagamento PIX via Asaas
4. Usuário é redirecionado para `/pagamento/[slug]`
5. Mostra QR Code e código PIX para copiar/colar
6. Polling a cada 5s verifica status do pagamento

### Após Confirmação (Webhook)
1. Asaas envia webhook `PAYMENT_CONFIRMED`
2. Sistema atualiza `is_premium = true`
3. Chama Gemini para gerar timeline completa
4. Salva todos os momentos no banco
5. Redireciona para `/h/[slug]` (página pública)

### Página Pública (/h/[slug])
- **Se grátis**: Mostra 4 momentos + CTA premium
- **Se premium**: Mostra todos os momentos + selo premium

## 4. Testar o Fluxo

### Teste em Sandbox (Desenvolvimento)
```bash
npm run dev
```

1. Acesse http://localhost:3000/criar
2. Faça upload de um arquivo de conversa
3. Clique em "Desbloquear Premium"
4. Use dados de teste:
   - Email: teste@example.com
   - CPF: 111.111.111-11 (opcional)

**Importante**: No ambiente sandbox, você pode simular pagamentos no painel da Asaas:
- Acesse: https://sandbox.asaas.com
- Entre com suas credenciais de sandbox
- Vá em "Cobranças" → Encontre o pagamento → Marcar como "Recebido"

### Webhook Local (Desenvolvimento)
Para testar webhooks localmente, use ngrok:

```bash
ngrok http 3000
```

Configure no Asaas (sandbox):
- URL: `https://seu-ngrok-url.ngrok.io/api/webhooks/asaas`
- Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED

## 5. Produção

### Antes de lançar:
1. Altere `ASAAS_ENV=production` no `.env.local`
2. Use a API Key de **produção** da Asaas
3. Configure webhook de produção no painel Asaas
4. Configure domínio em `NEXT_PUBLIC_APP_URL`

### Monitoramento:
- Logs de pagamento: Painel Asaas
- Erros de webhook: Logs do Vercel/servidor
- Status de stories: Supabase Dashboard

## 6. Preços e Limites

### Supabase (Free Tier):
- 500MB de storage
- 2GB de transferência/mês
- Suficiente para ~10.000 stories

### Asaas:
- Sandbox: Grátis (ilimitado)
- Produção: 1,49% por transação PIX
- R$ 9,90 - R$ 0,15 = R$ 9,75 líquido por venda

## 7. Troubleshooting

### "Erro ao carregar história"
- Verifique se o `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto
- Confirme que as policies RLS estão ativas

### "Erro ao criar pagamento"
- Verifique se `ASAAS_API_KEY` está correto
- Confirme que `ASAAS_ENV` está configurado (sandbox ou production)

### Webhook não dispara
- Confirme URL pública acessível (use ngrok em dev)
- Verifique logs em Asaas → Integrações → Webhooks

### Timeline não gera após pagamento
- Verifique se `GEMINI_API_KEY` está configurado
- Confirme que `conversation_text` foi salvo no preview
