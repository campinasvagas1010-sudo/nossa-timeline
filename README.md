# 💕 Nosso Timeline

**Transforme sua conversa do WhatsApp em uma história incrível!**

WebApp viral que cria automaticamente uma linha do tempo com momentos marcantes, estatísticas divertidas e cards prontos para compartilhar nas redes sociais.

## ✨ Features

### Implementado (v1.0 - MVP)
- ✅ **Página inicial** viral com hero section e exemplos
- ✅ **Upload de conversas** do WhatsApp (.txt)
- ✅ **Geração de prévia gratuita** (freemium)
- ✅ **Linha do tempo** com capítulos marcantes
- ✅ **Score de compatibilidade** (0-100%)
- ✅ **Modo Disputa** - batalhas estatísticas
- ✅ **Cards para Stories** - formato Instagram/WhatsApp
- ✅ **Design responsivo** e moderno com Tailwind CSS
- ✅ **Dados mock** para desenvolvimento

### ✅ Backend Completo (95%)
- ✅ **Parser WhatsApp** - iOS/Android funcionando
- ✅ **Gemini AI** - 15 categorias de batalha testadas
- ✅ **Endpoint /api/analyze** - análise completa implementada
- ✅ **Supabase** - schema SQL e cliente prontos
- ✅ **Asaas** - pagamento PIX R$ 9,90 configurado
- ✅ **Sistema de slugs** - URLs únicas /h/[slug]
- ⚠️ **Gerador de cards** - usar HTML2Canvas (canvas issue)

### Em desenvolvimento (Próximos passos)
- 🔄 **Conectar credenciais** - Supabase + Asaas (5 min)
- 🔄 **Página pública** da história (/h/[slug])
- 🔄 **Testar fluxo completo** - upload → análise → pagamento
- 🔄 **Componente de pagamento PIX** - QR Code + copia/cola
- 🔄 **Timeline com IA** - momentos marcantes extraídos

### Roadmap (Futuras features)
- 🔜 **Modo Romance** - versão emocional
- 🔜 **Modo Exposed** - arquivos secretos
- 🔜 **Compartilhamento social** - meta tags OG dinâmicas
- 🔜 **Export de cards** - download como imagem
- 🔜 **Analytics** - tracking de conversões

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo .env local
copy .env.example .env.local

# Executar em modo desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### Build para produção

```bash
npm run build
npm start
```

## 📁 Estrutura do projeto

```
nosso-timeline/
├── app/
│   ├── page.tsx                    # Página inicial (/)
│   ├── criar/
│   │   └── page.tsx                # Página de criação (/criar)
│   ├── preview/[id]/
│   │   └── page.tsx                # Página de prévia (/preview/[id])
│   ├── h/[slug]/
│   │   └── page.tsx                # Página pública (TODO)
│   ├── api/
│   │   └── generate/
│   │       └── route.ts            # API de geração
│   ├── layout.tsx                  # Layout raiz
│   └── globals.css                 # Estilos globais
├── components/
│   ├── CompatibilityScore.tsx     # Score circular animado
│   ├── TimelineSection.tsx        # Linha do tempo
│   ├── StatsComparison.tsx        # Batalhas estatísticas
│   └── ShareableCard.tsx          # Cards para Stories
├── lib/
│   ├── whatsapp-parser.ts         # Parser de conversa (.txt)
│   └── story-generator.ts         # Gerador de histórias (mock)
├── types/
│   └── story.ts                   # Tipos TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🎨 Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Deploy**: Vercel (recomendado)

## 🔧 Integrações futuras

### OpenAI
```typescript
// TODO: Descomentar quando configurar
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Usar em lib/story-generator.ts
```

### Supabase
```typescript
// TODO: Descomentar quando configurar
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Usar em app/api/generate/route.ts
```

### Pagamento (Asaas)
```typescript
// TODO: Implementar quando necessário
// Webhook endpoint: /api/webhook/asaas
```

## 📝 Como usar

1. **Exporte sua conversa do WhatsApp**:
   - Abra a conversa
   - Toque nos 3 pontinhos (⋮)
   - Mais → Exportar conversa
   - Escolha "Sem mídia"
   - Salve o arquivo .txt

2. **Faça upload no site**:
   - Acesse /criar
   - Upload do arquivo .txt
   - Escolha tipo de relação
   - Adicione nomes e fotos (opcional)
   - Clique em "Gerar prévia"

3. **Veja sua história**:
   - Score de compatibilidade
   - Linha do tempo com momentos
   - Estatísticas divertidas
   - Cards prontos para compartilhar

## 🎯 Estratégia de viralização

### Gatilhos virais implementados:
- ✅ **Score numérico** (compatibilidade 0-100%)
- ✅ **Batalhas competitivas** (quem manda mais mensagens, etc)
- ✅ **Curiosidades reveladoras** (fun facts)
- ✅ **Cards compartilháveis** (formato Stories)
- ✅ **Nostalgia** (primeira mensagem, momentos marcantes)

### Próximas features virais:
- 🔜 **Modo Exposed** - revelações constrangedoras
- 🔜 **Comparação com média** - benchmarks anônimos
- 🔜 **Quiz reverso** - amigos adivinham stats
- 🔜 **Red Flags vs Green Flags** - cards de comportamento

## 🐛 Debug

### Problemas comuns

**Upload não funciona**:
- Verifique se o arquivo é .txt
- Confirme que é uma conversa exportada do WhatsApp
- Limite: 10MB por arquivo

**Preview não carrega**:
- Preview expira após 1 hora (armazenamento em memória)
- Crie nova história para gerar novo preview

**Estilos não aparecem**:
- Execute `npm install` novamente
- Reinicie o servidor de desenvolvimento

## 📄 Licença

Projeto privado - Todos os direitos reservados

---

Feito com 💕 para eternizar memórias | [Nosso Timeline](https://nossotimeline.com)
