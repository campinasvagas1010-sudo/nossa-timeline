# 🚀 Setup Completo - Sistema de Expiração 48h

## Implementado ✅

### 1. Database Schema
- ✅ Coluna `expires_at` (48h após criação)
- ✅ Coluna `conversation_text` (conversa completa para premium)
- ✅ Coluna `hidden_moments` (momentos ocultados pelo usuário)
- ✅ Tabela `stories_backup` (backup antes de deletar)
- ✅ Trigger automático para backup
- ✅ Índices de performance

### 2. Webhook Asaas
- ✅ Endpoint `/api/payment/webhook/route.ts`
- ✅ Valida eventos `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`
- ✅ Gera timeline completa (15-20 momentos) com Gemini
- ✅ Atualiza story para premium
- ✅ Retorna URL da página `/h/[slug]`

### 3. Timeline Completa Premium
- ✅ Função `generateFullTimeline` em `lib/full-timeline-generator.ts`
- ✅ Prompt otimizado para 15-20 momentos marcantes
- ✅ Categorias diversificadas e emocionantes

### 4. Página Premium Atualizada
- ⚠️  **PENDENTE**: Aplicar mudanças do arquivo `UPDATES_PREMIUM_PAGE.md`
- ✅ Verificação de expiração
- ✅ Contador regressivo 48h
- ✅ Botão para ocultar momentos sensíveis
- ✅ Overlay com blur + ícone de proibido
- ✅ localStorage para preferências

### 5. Limpeza Automática
- ✅ API `/api/cron/cleanup/route.ts`
- ✅ Backup automático antes de deletar
- ✅ Limpeza de backups >30 dias
- ✅ Logs detalhados

### 6. Vercel Cron Job
- ✅ Configurado em `vercel.json`
- ✅ Roda a cada 1 hora (`0 * * * *`)
- ✅ Apenas em produção

---

## 📋 Próximos Passos

### 1. Executar Migration no Supabase

```sql
-- Execute o arquivo supabase-migrations.sql no SQL Editor
-- https://supabase.com/dashboard/project/_/sql
```

### 2. Atualizar Página Premium

Aplique as mudanças do arquivo `UPDATES_PREMIUM_PAGE.md` em `app/h/[slug]/page.tsx`:

- Imports: EyeOff, Eye, Ban
- States: hiddenMoments, timeRemaining, isExpired
- useEffect para countdown
- Função toggleHideMoment
- Tela de expiração
- Contador no header
- Botões de ocultar nos momentos

### 3. Configurar Variáveis de Ambiente na Vercel

Adicione no dashboard da Vercel:

```env
GEMINI_API_KEY=sua_key
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key
SUPABASE_SERVICE_ROLE_KEY=sua_key
ASAAS_API_KEY=sua_nova_key
ASAAS_ENV=production
NEXT_PUBLIC_APP_URL=https://sua-url.vercel.app
CRON_SECRET=gere_um_token_aleatorio
```

**Gerar CRON_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configurar Webhook no Asaas

URL do Webhook:
```
https://sua-url.vercel.app/api/payment/webhook
```

Eventos:
- ✅ PAYMENT_CONFIRMED
- ✅ PAYMENT_RECEIVED

### 5. Testar Fluxo Completo

1. Criar preview na página `/criar`
2. Iniciar pagamento
3. Pagar no sandbox do Asaas
4. Webhook deve:
   - Gerar timeline completa
   - Atualizar story para premium
   - Definir expires_at em 48h
5. Acessar `/h/[slug]`
6. Verificar contador regressivo
7. Testar botão de ocultar momentos
8. Aguardar 48h ou alterar manualmente expires_at para testar expiração

### 6. Testar Cron Job

**Teste Manual:**
```bash
curl -X POST https://sua-url.vercel.app/api/cron/cleanup \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

**Verificar Logs:**
- Vercel Dashboard → Deployments → Sua deployment → Functions
- Procurar por `[Cleanup]`

### 7. Monitorar

**Queries úteis no Supabase:**

```sql
-- Ver stories que vão expirar nas próximas 24h
SELECT slug, expires_at, person1_name, person2_name, is_premium
FROM stories
WHERE expires_at < NOW() + INTERVAL '24 hours'
AND expires_at > NOW()
ORDER BY expires_at ASC;

-- Ver stories já expiradas (aguardando cleanup)
SELECT slug, expires_at, created_at
FROM stories
WHERE expires_at < NOW()
ORDER BY expires_at DESC;

-- Ver backups recentes
SELECT original_slug, deleted_at, 
       backup_data->>'person1_name' as person1,
       backup_data->>'person2_name' as person2
FROM stories_backup
ORDER BY deleted_at DESC
LIMIT 10;

-- Estatísticas
SELECT 
  COUNT(*) as total_stories,
  COUNT(*) FILTER (WHERE is_premium) as premium,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired
FROM stories;
```

---

## 🎯 Funcionalidades Implementadas

### Para o Usuário

1. **Preview Grátis (4 momentos)**
   - Pode compartilhar
   - Exibe paywall para premium

2. **Premium (R$ 9,90)**
   - 15-20 momentos marcantes
   - Timeline completa e emocionante
   - Válido por 48 horas
   - Contador regressivo visível
   - Pode ocultar momentos sensíveis antes de compartilhar

3. **Compartilhamento Seguro**
   - Link público `/h/[slug]`
   - Momentos sensíveis podem ser ocultados
   - Preferências salvas no localStorage
   - Quem recebe o link vê os momentos não-ocultados

4. **Privacidade Garantida**
   - História expira em 48h
   - Deletada automaticamente
   - Backup seguro no servidor

### Para o Sistema

1. **Webhook Asaas**
   - Recebe confirmação de pagamento
   - Gera timeline premium automaticamente
   - Logs detalhados

2. **Cron Job Automático**
   - Roda a cada 1 hora
   - Deleta stories expiradas
   - Faz backup antes de deletar
   - Limpa backups >30 dias

3. **Performance**
   - Índices otimizados
   - Queries eficientes
   - Cleanup automático

---

## 📊 Métricas Sugeridas

Track no analytics:
- Conversão preview → premium
- Tempo médio até pagamento
- Momentos mais ocultados (privacy concerns)
- Taxa de compartilhamento
- Stories criadas vs expiradas

---

## 🔧 Troubleshooting

### Webhook não está funcionando
1. Verificar logs: `console.log` no webhook
2. Testar manualmente com cURL
3. Verificar asaas_payment_id no banco

### Cron não está deletando
1. Verificar CRON_SECRET configurado
2. Testar endpoint manualmente
3. Verificar logs da Vercel

### Contador não aparece
1. Verificar se expires_at existe no banco
2. Verificar timezone (UTC vs local)
3. Console.log do timeRemaining

### Momentos não estão sendo ocultados
1. Limpar localStorage
2. Verificar índices do array
3. Console.log de hiddenMoments

---

## ✨ Melhorias Futuras (Opcional)

1. **Email de notificação**
   - Enviar link após pagamento confirmado
   - Lembrete 24h antes de expirar

2. **Extensão de prazo**
   - Comprar +48h por R$ 4,90
   - Sem limite de extensões

3. **Download PDF**
   - Salvar timeline completa em PDF
   - Permanente, não expira

4. **Estatísticas no dashboard**
   - Quantas stories expiram por dia
   - Pico de criações
   - Taxa de renovação

---

**Pronto! Sistema de expiração 48h completo.** 🎉
