# 🚀 Deploy na Vercel - Passo a Passo

## 1️⃣ Preparar o Repositório GitHub

```bash
# Inicializar git (se ainda não foi feito)
git init
git add .
git commit -m "Initial commit - Nossa Timeline"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/nossa-timeline.git
git branch -M main
git push -u origin main
```

## 2️⃣ Deploy na Vercel

### Opção A: Via Dashboard (Recomendado)
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente (veja seção abaixo)
5. Clique em **"Deploy"**

### Opção B: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

## 3️⃣ Variáveis de Ambiente na Vercel

Configure estas variáveis em: **Project Settings → Environment Variables**

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://icobpmuaurvtlhxvfump.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2JwbXVhdXJ2dGxoeHZmdW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNDQxMjAsImV4cCI6MjA0ODkyMDEyMH0.m-1x0dhtPRPvwxGBDJgG0qO7gOTVQTL3-8aDm0z20-c
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2JwbXVhdXJ2dGxoeHZmdW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM0NDEyMCwiZXhwIjoyMDQ4OTIwMTIwfQ.iL0gxLFzI-NLljM7x0u10CtH7lJUHE5vAT8tZWx6Lro

# Asaas (Pagamento)
ASAAS_API_KEY=SUA_NOVA_API_KEY_AQUI
ASAAS_ENV=production

# URL da Aplicação
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

⚠️ **IMPORTANTE**: 
- Substitua `ASAAS_API_KEY` pela nova chave que você gerou
- Após o primeiro deploy, atualize `NEXT_PUBLIC_APP_URL` com a URL real da Vercel

## 4️⃣ Configurações Especiais

### Build Command
A Vercel detecta automaticamente Next.js, mas caso precise:
```
npm run build
```

### Install Command
Se houver problemas com dependências:
```
npm install --legacy-peer-deps
```

### Node.js Version
Recomendado: **Node 18.x ou 20.x**
Configure em: Project Settings → General → Node.js Version

## 5️⃣ Domínio Personalizado (Opcional)

1. Vá em **Project Settings → Domains**
2. Adicione seu domínio (ex: `nossa-timeline.com`)
3. Configure DNS conforme instruções da Vercel

## 6️⃣ Webhook do Asaas

Após o deploy, configure o webhook no painel do Asaas:

**URL do Webhook:**
```
https://seu-dominio.vercel.app/api/payment/webhook
```

**Eventos:**
- ✅ PAYMENT_CONFIRMED
- ✅ PAYMENT_RECEIVED

## 7️⃣ Verificar Deploy

Após o deploy, teste:
- ✅ Página inicial: `https://seu-dominio.vercel.app`
- ✅ Upload de conversa
- ✅ Geração de preview (pode demorar ~8s)
- ✅ Criação de pagamento PIX
- ✅ Compartilhamento de cards

## 🔧 Troubleshooting

### Erro: "Module not found: Can't resolve 'canvas'"
A biblioteca `canvas` pode não funcionar na Vercel. Se necessário, remova do `package.json`.

### Erro: "Environment variable not found"
Certifique-se de que todas as variáveis foram adicionadas na Vercel e faça um **Redeploy**.

### Timeout na geração da timeline
Vercel tem limite de 10s para Hobby plan. Se necessário:
- Upgrade para Pro plan
- Ou otimize as chamadas ao Gemini

## 📱 Monitoramento

- **Analytics**: Project Settings → Analytics
- **Logs**: Deployments → [sua deployment] → Function Logs
- **Erros**: Runtime Logs (em tempo real)

---

**Pronto!** Seu projeto estará no ar em minutos! 🎉
