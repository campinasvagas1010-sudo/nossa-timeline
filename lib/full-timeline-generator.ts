import { analyzeWithGemini } from './gemini-service';

/**
 * Gera timeline COMPLETA (15-20 momentos) para versão premium
 */
export async function generateFullTimeline(params: {
  conversationText: string;
  person1Name: string;
  person2Name: string;
  relationType: 'casal' | 'amizade';
}) {
  const { conversationText, person1Name, person2Name, relationType } = params;

  const prompt = `
Você é um especialista em análise de conversas e storytelling. Analise a conversa completa abaixo e crie uma timeline DETALHADA e EMOCIONANTE da história dessas pessoas.

**PESSOAS:**
- ${person1Name}
- ${person2Name}

**TIPO DE RELAÇÃO:** ${relationType === 'casal' ? 'Namoro/Relacionamento Romântico' : 'Amizade'}

**CONVERSA COMPLETA:**
${conversationText.substring(0, 50000)} // Limitar para não explodir tokens

**TAREFA:**
Identifique 15-20 momentos marcantes que contam a história COMPLETA dessa relação. Vá além do óbvio - encontre momentos que vão fazer a pessoa dizer "eu tinha esquecido disso!".

Para cada momento, forneça:

1. **title**: Nome curto e impactante (ex: "A Briga do Cinema", "Quando Você Me Ligou Bêbado")
2. **emoji**: Emoji que representa perfeitamente o momento
3. **category**: Categoria (INÍCIO, BRIGA, ROMANCE, ENGRAÇADO, SURPRESA, CRISE, VIAGEM, DECLARAÇÃO, etc.)
4. **description**: Descrição envolvente de 2-3 frases que conte o contexto
5. **snippet**: Trecho REAL da conversa (1-3 mensagens que exemplificam)
6. **date**: Data aproximada ou período (ex: "15 Jan 2024" ou "Início de Fevereiro")

**DIRETRIZES:**
- Priorize momentos com ALTA carga emocional
- Inclua mix de positivos, negativos e neutros (vida real tem altos e baixos)
- Use emojis criativos e apropriados
- Momentos devem ter snippets REAIS da conversa
- Varie as categorias para criar uma história rica
- Ordem cronológica aproximada
- Seja específico: "A Briga do Restaurante" > "Uma Briga"

**CATEGORIAS SUGERIDAS:**
INÍCIO, PRIMEIRO_ENCONTRO, DECLARAÇÃO, ROMANCE, CIÚME, BRIGA, RECONCILIAÇÃO, VIAGEM, ANIVERSÁRIO, SURPRESA, CRISE, APOIO, ENGRAÇADO, ÍNTIMO, SAUDADE, PLANOS_FUTURO

Retorne APENAS JSON válido:
{
  "moments": [
    {
      "title": "O Primeiro 'Oi' Tímido",
      "emoji": "✨",
      "category": "INÍCIO",
      "description": "Tudo começou com uma mensagem simples, mas que mudou completamente a vida de vocês dois. Quem diria que um 'oi' poderia levar a tudo isso?",
      "snippet": "[15/01/2024 18:30] ${person1Name}: Oi! Tudo bem?\n[15/01/2024 18:35] ${person2Name}: Oiii! Tudo sim, e você?",
      "date": "15 Jan 2024"
    },
    {
      "title": "A Declaração Inesperada",
      "emoji": "💕",
      "category": "DECLARAÇÃO",
      "description": "Foi num momento aleatório que você soltou aquelas palavras. Ninguém esperava, mas todo mundo sentia.",
      "snippet": "[20/02/2024 23:45] ${person1Name}: Você sabe que eu tô... tipo... me apaixonando por você né?",
      "date": "20 Fev 2024"
    }
  ]
}
`;

  console.log('[Full Timeline] Gerando timeline completa com Gemini...');
  const response = await analyzeWithGemini(prompt);
  
  const moments = (response as any).moments || [];
  console.log('[Full Timeline] ✅ Timeline gerada:', moments.length, 'momentos');

  return moments;
}
