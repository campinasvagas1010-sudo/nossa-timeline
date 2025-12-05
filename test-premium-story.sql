/**
 * Script de teste - Insere uma story premium de teste no Supabase
 * Para testar a página premium localmente
 * 
 * Execute no SQL Editor do Supabase ou adapte para API
 */

-- Deletar story de teste anterior (se existir)
DELETE FROM stories WHERE slug = 'test-premium';

-- Inserir story premium de teste
INSERT INTO stories (
  slug,
  person1_name,
  person2_name,
  relationship_type,
  start_date,
  end_date,
  total_messages,
  is_premium,
  expires_at,
  conversation_text,
  battles,
  timeline,
  created_at
) VALUES (
  'test-premium',
  'Ana',
  'Pedro',
  'casal',
  '2024-01-01',
  '2024-12-01',
  1500,
  true,
  NOW() + INTERVAL '2 hours', -- Expira em 2 horas para testar o contador
  'Conversa de teste...',
  '[
    {
      "id": "brigas",
      "title": "Brigas",
      "winner": "Ana",
      "confidence": 85,
      "stat": "12"
    }
  ]'::jsonb,
  '[
    {
      "title": "O Primeiro Oi",
      "emoji": "✨",
      "category": "INÍCIO",
      "description": "Tudo começou com uma mensagem simples que mudou completamente a vida de vocês dois.",
      "snippet": "[15/01/2024 18:30] Ana: Oi! Tudo bem?\\n[15/01/2024 18:35] Pedro: Oiii! Tudo sim!",
      "date": "15 Jan 2024"
    },
    {
      "title": "A Declaração Inesperada",
      "emoji": "💕",
      "category": "DECLARAÇÃO",
      "description": "Foi num momento aleatório que você soltou aquelas palavras. Ninguém esperava, mas todo mundo sentia.",
      "snippet": "[20/02/2024 23:45] Pedro: Você sabe que eu tô... tipo... me apaixonando por você né?",
      "date": "20 Fev 2024"
    },
    {
      "title": "A Briga do Cinema",
      "emoji": "😠",
      "category": "BRIGA",
      "description": "Aquela discussão sobre qual filme assistir virou algo muito maior. Duraram 3 dias sem se falar.",
      "snippet": "[05/03/2024 21:10] Ana: Você sempre escolhe o que assistir!\\n[05/03/2024 21:15] Pedro: Não é verdade, da última vez...",
      "date": "05 Mar 2024"
    },
    {
      "title": "A Reconciliação",
      "emoji": "🌹",
      "category": "ROMANCE",
      "description": "Ele apareceu na sua casa com flores. Você não resistiu e começou a chorar.",
      "snippet": "[08/03/2024 19:30] Pedro: Eu tô aqui na sua porta...\\n[08/03/2024 19:32] Ana: Que isso, amor 😭",
      "date": "08 Mar 2024"
    },
    {
      "title": "Planos de Morar Juntos",
      "emoji": "🏠",
      "category": "PLANOS_FUTURO",
      "description": "Pela primeira vez vocês falaram sério sobre dividir um apê. Foi assustador e emocionante ao mesmo tempo.",
      "snippet": "[15/04/2024 22:00] Ana: E se a gente pegasse um apê juntos?\\n[15/04/2024 22:05] Pedro: Sério? Você quer mesmo?",
      "date": "15 Abr 2024"
    },
    {
      "title": "O Aniversário Surpresa",
      "emoji": "🎂",
      "category": "SURPRESA",
      "description": "Ela planejou tudo em segredo. Você entrou em casa e todos os seus amigos gritaram Parabéns!",
      "snippet": "[20/05/2024 20:15] Ana: Onde você tá?\\n[20/05/2024 20:20] Pedro: Chegando! Por quê?\\n[20/05/2024 20:25] Ana: Só curiosidade 😏",
      "date": "20 Mai 2024"
    },
    {
      "title": "Ciúmes no Instagram",
      "emoji": "😤",
      "category": "CIÚME",
      "description": "Aquele like em foto da ex virou o maior climão. Vocês passaram a noite discutindo sobre limites.",
      "snippet": "[10/06/2024 23:50] Ana: Por que você curtiu a foto dela?\\n[10/06/2024 23:55] Pedro: Foi sem querer, eu nem vi direito",
      "date": "10 Jun 2024"
    },
    {
      "title": "A Viagem dos Sonhos",
      "emoji": "✈️",
      "category": "VIAGEM",
      "description": "Compraram as passagens para a viagem que sempre sonharam. Destino: Europa!",
      "snippet": "[25/07/2024 15:30] Pedro: Comprei!!! Consegui as passagens!!!\\n[25/07/2024 15:31] Ana: AAAAAH SÉRIO??? 😍😍😍",
      "date": "25 Jul 2024"
    },
    {
      "title": "O Dia que Ele Chorou",
      "emoji": "😢",
      "category": "APOIO",
      "description": "Ele perdeu o avô e você ficou ao lado dele a noite inteira. Foi quando ele percebeu que te amava de verdade.",
      "snippet": "[05/08/2024 02:30] Pedro: Obrigado por estar aqui...\\n[05/08/2024 02:31] Ana: Sempre, amor. Sempre.",
      "date": "05 Ago 2024"
    },
    {
      "title": "O Momento Engraçado",
      "emoji": "🤣",
      "category": "ENGRAÇADO",
      "description": "Ela mandou um áudio no grupo errado falando dele. Vocês riram por dias disso.",
      "snippet": "[20/09/2024 19:00] Ana: CARALHO EU MANDEI NO GRUPO ERRADO\\n[20/09/2024 19:01] Pedro: KKKKKKKKKKK EU VI",
      "date": "20 Set 2024"
    },
    {
      "title": "Conhecendo a Família",
      "emoji": "👨‍👩‍👧‍👦",
      "category": "INÍCIO",
      "description": "O dia que ele foi jantar na casa dos seus pais. Ele estava mais nervoso que você.",
      "snippet": "[15/10/2024 17:00] Pedro: Tô suando frio aqui\\n[15/10/2024 17:05] Ana: Eles vão te amar, relaxa!",
      "date": "15 Out 2024"
    },
    {
      "title": "A Conversa Séria",
      "emoji": "💬",
      "category": "CRISE",
      "description": "Vocês precisavam conversar sobre para onde a relação estava indo. Foi difícil mas necessário.",
      "snippet": "[01/11/2024 21:00] Ana: Precisamos conversar sério...\\n[01/11/2024 21:10] Pedro: Tá, eu também queria falar...",
      "date": "01 Nov 2024"
    },
    {
      "title": "Eu Te Amo",
      "emoji": "❤️",
      "category": "DECLARAÇÃO",
      "description": "A primeira vez que ele disse eu te amo. Do nada, no meio de uma conversa normal.",
      "snippet": "[10/11/2024 14:30] Pedro: Eu te amo\\n[10/11/2024 14:31] Ana: O QUE???\\n[10/11/2024 14:32] Pedro: Eu te amo. Era isso.",
      "date": "10 Nov 2024"
    },
    {
      "title": "Saudade da Madrugada",
      "emoji": "🌙",
      "category": "SAUDADE",
      "description": "Ele estava viajando e te mandou mensagem às 3 da manhã dizendo que não conseguia dormir de saudade.",
      "snippet": "[20/11/2024 03:15] Pedro: Tô acordado pensando em você\\n[20/11/2024 03:17] Ana: Amor, você tá bem?\\n[20/11/2024 03:18] Pedro: Só com muita saudade",
      "date": "20 Nov 2024"
    },
    {
      "title": "Onde Vamos Estar Daqui a 5 Anos?",
      "emoji": "🔮",
      "category": "PLANOS_FUTURO",
      "description": "Aquela conversa profunda sobre o futuro de vocês. Casamento, filhos, sonhos... tudo.",
      "snippet": "[01/12/2024 22:00] Ana: Você me vê no seu futuro?\\n[01/12/2024 22:05] Pedro: Você É o meu futuro",
      "date": "01 Dez 2024"
    }
  ]'::jsonb,
  NOW()
);

-- Verificar
SELECT 
  slug, 
  person1_name, 
  person2_name, 
  is_premium, 
  expires_at,
  jsonb_array_length(timeline) as total_moments
FROM stories 
WHERE slug = 'test-premium';

-- URL para testar:
-- http://localhost:3000/h/test-premium
