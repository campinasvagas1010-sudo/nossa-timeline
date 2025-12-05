import {
  Story,
  TimelineChapter,
  Statistics,
  ShareableCard,
  RomanceMode,
  DisputaMode,
  ExposedMode,
  RelationType,
  PreviewStoryData,
  Battle,
} from '@/types/story';
import { ParsedConversation, validateConversationSize } from './whatsapp-parser';
import { detectAllPatterns } from './pattern-detector';
import { interpretBattleResults, BattleResult } from './ai-battle-interpreter';

/**
 * Gerador de histórias completas a partir de conversas parseadas
 * 
 * TODO: INTEGRAR COM OPENAI AQUI
 * Quando integrar, esta função vai:
 * 1. Enviar a conversa parseada para a OpenAI
 * 2. Usar prompts específicos para gerar timeline, stats, modos
 * 3. Retornar a história completa estruturada
 * 
 * Por enquanto, retorna dados MOCK para desenvolvimento
 */

export interface GenerateStoryOptions {
  parsedConversation: ParsedConversation;
  relationType: RelationType;
  person1Name: string;
  person2Name: string;
  person1PhotoUrl?: string;
  person2PhotoUrl?: string;
}

export async function generateStoryFromConversation(options: GenerateStoryOptions): Promise<Story> {
  console.log('[Story Generator] Generating story...');
  console.log('[Story Generator] Relation type:', options.relationType);
  console.log('[Story Generator] Participants:', options.person1Name, options.person2Name);
  
  const { parsedConversation, person1Name, person2Name } = options;
  
  // 1. VALIDAR TAMANHO DA CONVERSA (prevenir custos desnecessários)
  const validation = validateConversationSize(parsedConversation);
  
  if (!validation.isValid) {
    throw new Error(validation.warnings[0]);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('[Story Generator]', validation.warnings[0]);
  }
  
  console.log(`[Story Generator] Conversa validada: ${validation.messageCount} mensagens (tier: ${validation.tier})`);
  console.log(`[Story Generator] Custo estimado: $${validation.estimatedCost.toFixed(2)}`);
  
  // 2. DETECTAR PADRÕES (regex analysis)
  console.log('[Story Generator] 🔍 Analisando padrões...');
  const patterns = detectAllPatterns(parsedConversation);
  
  console.log(`[Story Generator] Padrões detectados: ${patterns.metadata.totalMessages} mensagens analisadas`);
  console.log(`[Story Generator] Mensagens filtradas: ${patterns.metadata.filteredCount} (${patterns.metadata.reductionPercentage}% redução)`);
  
  // 3. ANALISAR OS 5 CARDS COM GEMINI
  console.log('[Story Generator] 🤖 Analisando os 5 cards...');
  let cardsAnalysis: any = null;
  
  try {
    // Preparar amostra de mensagens para análise
    const messageSample = parsedConversation.messages
      .slice(0, 500) // Primeiras 500 mensagens
      .map(m => `[${m.timestamp.toLocaleString()}] ${m.sender}: ${m.content}`)
      .join('\n');
    
    const { analyzeFiveCards } = await import('./gemini-service');
    cardsAnalysis = await analyzeFiveCards(
      messageSample,
      person1Name,
      person2Name,
      options.relationType === 'familia' ? 'casal' : options.relationType
    );
    
    console.log(`[Story Generator] ✅ 5 cards analisados com sucesso`);
  } catch (error) {
    console.error('[Story Generator] Erro ao analisar cards:', error);
    console.log('[Story Generator] Usando dados mock como fallback');
  }
  
  // 4. GERAR STORY COMPLETA
  console.log('[Story Generator] ✨ Gerando história completa...');
  return generateMockStory(options, cardsAnalysis);
}

/**
 * Gera apenas a PREVIEW (freemium) da história
 * Contém: 3-4 capítulos, 5 stats, 1 card, score
 */
export async function generatePreviewStory(options: GenerateStoryOptions): Promise<PreviewStoryData> {
  console.log('[Story Generator] Generating PREVIEW story...');
  
  const fullStory = await generateStoryFromConversation(options);
  
  // Pegar apenas os primeiros capítulos e stats limitadas
  return {
    id: fullStory.id,
    compatibilityScore: fullStory.compatibilityScore,
    timelinePreview: fullStory.timeline.slice(0, 3), // Primeiros 3 capítulos
    statsPreview: {
      general: fullStory.stats.general,
      comparison: fullStory.stats.comparison,
      fun: {
        ...fullStory.stats.fun,
        coincidences: fullStory.stats.fun.coincidences.slice(0, 2),
        funFacts: fullStory.stats.fun.funFacts.slice(0, 3),
      },
    },
    cardPreview: fullStory.shareableCards[0], // 1 card de exemplo
    metadata: fullStory.metadata,
    participants: fullStory.participants,
  };
}

/**
 * MOCK: Gera uma história completa fictícia
 * REMOVER quando implementar integração com IA
 */
function generateMockStory(options: GenerateStoryOptions, cardsAnalysis?: any): Story {
  const { parsedConversation, relationType, person1Name, person2Name, person1PhotoUrl, person2PhotoUrl } = options;
  
  const id = generateUniqueId();
  const slug = generateSlug(person1Name, person2Name);
  
  // Calcular compatibility score baseado em métricas fake
  const compatibilityScore = calculateMockCompatibilityScore(relationType);
  
  const story: Story = {
    id,
    slug,
    metadata: {
      startDate: parsedConversation.startDate,
      endDate: parsedConversation.endDate,
      totalMessages: parsedConversation.totalMessages,
      participants: [person1Name, person2Name],
      relationType,
    },
    participants: {
      person1: {
        name: person1Name,
        photoUrl: person1PhotoUrl,
      },
      person2: {
        name: person2Name,
        photoUrl: person2PhotoUrl,
      },
    },
    compatibilityScore,
    timeline: generateMockTimeline(person1Name, person2Name, relationType),
    stats: generateMockStatistics(person1Name, person2Name),
    modes: {
      romance: generateMockRomanceMode(person1Name, person2Name, relationType),
      disputa: cardsAnalysis && cardsAnalysis.cards
        ? generateDisputaModeFromCards(person1Name, person2Name, cardsAnalysis.cards)
        : generateMockDisputaMode(person1Name, person2Name),
      exposed: generateMockExposedMode(person1Name, person2Name),
    },
    shareableCards: cardsAnalysis && cardsAnalysis.cards
      ? generateShareableCardsFromAnalysis(person1Name, person2Name, cardsAnalysis.cards, compatibilityScore)
      : generateMockShareableCards(person1Name, person2Name, compatibilityScore),
    createdAt: new Date(),
    isPremium: false,
  };
  
  return story;
}

// ==========================================
// GERADORES MOCK DE CADA SEÇÃO
// ==========================================

function generateMockTimeline(person1: string, person2: string, relationType: RelationType): TimelineChapter[] {
  const isCouple = relationType === 'casal';
  
  return [
    {
      id: '1',
      title: 'Como tudo começou',
      subtitle: '15 de Janeiro, 2024',
      date: new Date('2024-01-15'),
      description: isCouple 
        ? `${person1} e ${person2} trocaram as primeiras mensagens. Tudo começou com um simples "Oi", mas já dava pra sentir que seria especial. 💫`
        : `A amizade entre ${person1} e ${person2} começou aqui! Quem diria que essas primeiras mensagens marcariam o início de algo tão incrível?`,
      messages: [],
      emoji: '✨',
      category: 'inicio',
    },
    {
      id: '2',
      title: isCouple ? 'O primeiro flerte' : 'Primeira conversa séria',
      subtitle: '20 de Janeiro, 2024',
      date: new Date('2024-01-20'),
      description: isCouple
        ? 'As conversas começaram a ficar mais longas, os emojis mais fofos... E aquela demora pra responder só porque queria pensar na resposta perfeita. 😊'
        : `${person1} e ${person2} tiveram sua primeira conversa profunda sobre a vida. É aí que a amizade se fortalece!`,
      messages: [],
      emoji: isCouple ? '💕' : '🤝',
      category: 'milestone',
    },
    {
      id: '3',
      title: 'Momento especial',
      subtitle: '14 de Fevereiro, 2024',
      date: new Date('2024-02-14'),
      description: isCouple
        ? `Dia dos Namorados! ${person2} foi o primeiro a mandar mensagem à meia-noite. Romântico demais! 🌹`
        : `Um momento marcante que vocês sempre vão lembrar. A amizade já estava consolidada!`,
      messages: [],
      emoji: '❤️',
      category: 'especial',
    },
    {
      id: '4',
      title: isCouple ? 'Primeira declaração' : 'Parceria total',
      subtitle: '10 de Março, 2024',
      date: new Date('2024-03-10'),
      description: isCouple
        ? `"Eu te amo" pela primeira vez! ${person1} tomou coragem e mandou. ${person2} respondeu 10 segundos depois (tava ansioso). 💖`
        : `${person1} e ${person2} já viraram parceiros inseparáveis. Sempre um ajudando o outro!`,
      messages: [],
      emoji: isCouple ? '💝' : '🌟',
      category: 'especial',
    },
    {
      id: '5',
      title: 'Aquele desentendimento',
      subtitle: '5 de Maio, 2024',
      date: new Date('2024-05-05'),
      description: 'Nem tudo são flores, né? Teve aquela discussão boba que quase virou um drama. Mas no final, só fortaleceu a relação. 💪',
      messages: [],
      emoji: '😤',
      category: 'conflito',
    },
    {
      id: '6',
      title: 'Reconciliação',
      subtitle: '6 de Maio, 2024',
      date: new Date('2024-05-06'),
      description: 'E veio aquele pedido de desculpas sincero. Conversaram, se entenderam, e ficou tudo ainda melhor do que antes. 🤗',
      messages: [],
      emoji: '🫂',
      category: 'reconciliacao',
    },
    {
      id: '7',
      title: 'Memória inesquecível',
      subtitle: '20 de Agosto, 2024',
      date: new Date('2024-08-20'),
      description: `Um dia que ficou marcado na história de vocês dois. As mensagens desse dia mostram o quanto ${person1} e ${person2} se importam um com o outro. 🌈`,
      messages: [],
      emoji: '🎉',
      category: 'memoria',
    },
    {
      id: '8',
      title: 'Até hoje...',
      subtitle: '3 de Dezembro, 2024',
      date: new Date('2024-12-03'),
      description: isCouple
        ? `E a história continua! São ${Math.floor((new Date('2024-12-03').getTime() - new Date('2024-01-15').getTime()) / (1000 * 60 * 60 * 24))} dias de conversas, risadas, brigas bobas e muito amor. E isso é só o começo! 💫`
        : `A amizade só cresce! Já são ${Math.floor((new Date('2024-12-03').getTime() - new Date('2024-01-15').getTime()) / (1000 * 60 * 60 * 24))} dias de parceria. Que venham muitos mais! 🚀`,
      messages: [],
      emoji: '🌟',
      category: 'especial',
    },
  ];
}

function generateMockStatistics(person1: string, person2: string): Statistics {
  return {
    general: {
      totalDays: 323,
      totalMessages: 8547,
      totalWords: 42735,
      averageMessagesPerDay: 26.5,
      longestConversation: {
        date: new Date('2024-02-14'),
        messageCount: 247,
      },
      quietestPeriod: {
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-07-13'),
        days: 3,
      },
    },
    comparison: {
      person1: {
        name: person1,
        totalMessages: 4523,
        averageMessageLength: 45,
        totalEmojis: 1247,
        totalAudios: 89,
        totalPhotos: 134,
        averageResponseTime: '12 min',
        mostUsedEmoji: '😊',
        mostUsedWord: 'amor',
        longestMessage: {
          content: 'Essa foi aquela mensagem gigante que você mandou explicando tudo em detalhes...',
          wordCount: 287,
        },
        messagesByHour: {
          '00': 12, '01': 5, '02': 2, '03': 1,
          '08': 45, '09': 67, '10': 89, '11': 102,
          '12': 156, '13': 134, '14': 123, '15': 98,
          '18': 234, '19': 267, '20': 345, '21': 289,
          '22': 198, '23': 67,
        },
      },
      person2: {
        name: person2,
        totalMessages: 4024,
        averageMessageLength: 38,
        totalEmojis: 987,
        totalAudios: 145,
        totalPhotos: 98,
        averageResponseTime: '45 min',
        mostUsedEmoji: '❤️',
        mostUsedWord: 'linda',
        longestMessage: {
          content: 'E essa foi a sua mensagem mais longa, contando aquela história toda...',
          wordCount: 198,
        },
        messagesByHour: {
          '00': 23, '01': 15, '02': 8, '03': 5,
          '08': 34, '09': 56, '10': 78, '11': 89,
          '12': 123, '13': 145, '14': 167, '15': 134,
          '18': 198, '19': 234, '20': 289, '21': 312,
          '22': 245, '23': 123,
        },
      },
      winner: {
        mostMessages: person1,
        mostEmojis: person1,
        mostAudios: person2,
        fastestResponder: person1,
        nightOwl: person2,
        morningPerson: person1,
      },
    },
    fun: {
      totalEmojis: 2234,
      totalLaughs: 456,
      totalHearts: 789,
      mostUsedPhrase: 'te amo',
      coincidences: [
        `Vocês disseram "eu te amo" ao mesmo tempo 12 vezes`,
        `${person1} e ${person2} mandaram o mesmo emoji em sequência 34 vezes`,
        `Vocês tiveram 5 conversas que duraram mais de 6 horas seguidas`,
      ],
      funFacts: [
        `Vocês trocaram 247 mensagens em um único dia (recorde!)`,
        `${person2} mandou um áudio de 7 minutos (o mais longo!)`,
        `A palavra "amor" apareceu 892 vezes na conversa`,
        `Vocês se falaram todos os dias por 127 dias seguidos`,
        `${person1} usa 2x mais emojis que a média das pessoas`,
      ],
    },
    emotional: {
      sweetestMoment: {
        date: new Date('2024-03-10'),
        message: 'Eu te amo ❤️',
        sender: person1,
      },
      funniestMoment: {
        date: new Date('2024-04-01'),
        message: 'KKKKKKKK NÃO ACREDITO QUE VOCÊ FEZ ISSO',
        sender: person2,
      },
      mostEmotionalDay: {
        date: new Date('2024-02-14'),
        reason: 'Dia dos Namorados - vocês trocaram mensagens o dia todo',
      },
      firstILoveYou: {
        date: new Date('2024-03-10'),
        sender: person1,
      },
    },
  };
}

function generateMockRomanceMode(person1: string, person2: string, relationType: RelationType): RomanceMode {
  if (relationType === 'casal') {
    return {
      title: 'Uma História de Amor',
      summary: `${person1} e ${person2} escreveram juntos uma história incrível de amor ao longo de 323 dias. Começou com um simples "Oi" e se transformou em 8.547 mensagens cheias de carinho, emojis apaixonados e declarações sinceras. Vocês já disseram "eu te amo" centenas de vezes, enfrentaram desafios juntos e criaram memórias inesquecíveis. Cada mensagem é uma prova de que o amor de vocês é real, intenso e único. Essa é apenas o começo de uma jornada que promete ser longa e cheia de amor! 💕`,
      highlights: [
        {
          title: 'Conexão instantânea',
          description: 'Desde a primeira conversa, vocês sentiram que seria especial',
          emoji: '✨',
          date: new Date('2024-01-15'),
        },
        {
          title: 'Primeira declaração',
          description: `${person1} tomou coragem e disse "eu te amo" pela primeira vez`,
          emoji: '💖',
          date: new Date('2024-03-10'),
        },
        {
          title: 'Sempre juntos',
          description: 'Vocês conversaram todos os dias por 127 dias seguidos',
          emoji: '🔒',
        },
        {
          title: 'Superando desafios',
          description: 'Vocês provaram que podem superar qualquer obstáculo juntos',
          emoji: '💪',
        },
      ],
      loveScore: 94,
    };
  } else if (relationType === 'amizade') {
    return {
      title: 'A História da Amizade',
      summary: `${person1} e ${person2} construíram uma amizade incrível ao longo de 323 dias. São 8.547 mensagens que mostram o quanto vocês se importam um com o outro. Através de risadas, conselhos, desabafos e momentos especiais, vocês criaram uma conexão única. Essa é a história de uma parceria que vai durar para sempre! 🤝💙`,
      highlights: [
        {
          title: 'Sempre presentes',
          description: 'Vocês sempre estiveram lá um pro outro nos momentos importantes',
          emoji: '🤝',
        },
        {
          title: 'Risadas garantidas',
          description: '456 "kkkkk" e "hahaha" provam que vocês sabem se divertir juntos',
          emoji: '😂',
        },
        {
          title: 'Parceria total',
          description: 'Seja pra comemorar ou desabafar, vocês são parceiros de verdade',
          emoji: '💪',
        },
      ],
      loveScore: 92,
    };
  } else {
    return {
      title: 'História Especial',
      summary: `${person1} e ${person2} têm uma relação única e cheia de momentos especiais!`,
      highlights: [
        {
          title: 'Conexão especial',
          description: 'Vocês compartilham momentos únicos e inesquecíveis',
          emoji: '🌟',
        },
      ],
      loveScore: 80,
    };
  }
}

/**
 * Converte análise dos 5 cards do Gemini para formato DisputaMode
 */
function generateDisputaModeFromCards(person1: string, person2: string, cards: any[]): DisputaMode {
  const battles: Battle[] = cards.map(card => ({
    category: card.title,
    person1Score: card.winner === person1 ? card.stat : '-',
    person2Score: card.winner === person2 ? card.stat : '-',
    winner: card.winner,
    emoji: getEmojiForCard(card.id),
    confidence: card.confidence,
    evidence: [],
    cardImage: `/cards/${card.id}.png`,
  }));

  const person1Wins = battles.filter(b => b.winner === person1).length;
  const person2Wins = battles.filter(b => b.winner === person2).length;
  const overallWinner = person1Wins > person2Wins ? person1 : person2;

  return {
    title: 'Modo Disputa: Quem é Quem?',
    battles,
    overallWinner,
  };
}

function getEmojiForCard(cardId: string): string {
  const emojiMap: Record<string, string> = {
    brigas: '🔥',
    ciume: '🔍',
    demora: '⏰',
    orgulho: '😤',
    vacuo: '👻',
  };
  return emojiMap[cardId] || '⚔️';
}

/**
 * Converte BattleResults da IA para formato DisputaMode (LEGACY)
 */
function generateDisputaModeFromBattles(person1: string, person2: string, battleResults: BattleResult[]): DisputaMode {
  // Mapear categorias para emojis e nomes display
  const categoryMap: Record<string, { emoji: string; displayName: string }> = {
    ciume: { emoji: '🔍', displayName: 'Mais Ciumento(a)' },
    brigas: { emoji: '🔥', displayName: 'Iniciador(a) de DR' },
    demora: { emoji: '⏰', displayName: 'Campeão(ã) da Demora' },
    vacuo: { emoji: '👻', displayName: 'Rei/Rainha do Vácuo' },
    orgulho: { emoji: '😤', displayName: 'Mais Orgulhoso(a)' },
  };
  
  const battles: Battle[] = battleResults.map(result => {
    const categoryInfo = categoryMap[result.category] || { emoji: '⚔️', displayName: result.category };
    
    return {
      category: categoryInfo.displayName,
      metric: result.result,
      person1Score: result.winner === person1 ? '🏆 Vencedor' : '-',
      person2Score: result.winner === person2 ? '🏆 Vencedor' : '-',
      winner: result.winner,
      emoji: categoryInfo.emoji,
      funnyComment: result.funnyComment || result.result,
      confidence: result.confidence,
      evidence: result.evidence,
      cardImage: result.cardImage,
      analysisTimeframe: result.category === 'demora' 
        ? { months: 6, description: 'Últimos 6 meses' }
        : result.category === 'orgulho'
        ? { months: 12, description: 'Último ano' }
        : undefined,
    };
  });
  
  // Calcular vencedor geral (quem ganhou mais batalhas)
  const person1Wins = battles.filter(b => b.winner === person1).length;
  const person2Wins = battles.filter(b => b.winner === person2).length;
  const overallWinner = person1Wins > person2Wins ? person1 : person2;
  
  return {
    title: 'Modo Disputa: Quem é Quem?',
    battles,
    overallWinner,
  };
}

function generateMockDisputaMode(person1: string, person2: string): DisputaMode {
  return {
    title: 'Modo Disputa: Quem é Quem?',
    battles: [
      {
        category: 'Mais tagarela',
        person1Score: 4523,
        person2Score: 4024,
        winner: person1,
        emoji: '💬',
      },
      {
        category: 'Rei/Rainha do vácuo',
        person1Score: '12 min',
        person2Score: '45 min',
        winner: person2,
        emoji: '👻',
      },
      {
        category: 'Mais emotivo',
        person1Score: 1247,
        person2Score: 987,
        winner: person1,
        emoji: '😊',
      },
      {
        category: 'Mais falante',
        person1Score: 89,
        person2Score: 145,
        winner: person2,
        emoji: '🎤',
      },
      {
        category: 'Fotógrafo oficial',
        person1Score: 134,
        person2Score: 98,
        winner: person1,
        emoji: '📸',
      },
      {
        category: 'Coruja noturna',
        person1Score: 67,
        person2Score: 123,
        winner: person2,
        emoji: '🦉',
      },
      {
        category: 'Madrugador(a)',
        person1Score: 145,
        person2Score: 89,
        winner: person1,
        emoji: '🌅',
      },
    ],
    overallWinner: person1,
  };
}

function generateMockExposedMode(person1: string, person2: string): ExposedMode {
  return {
    title: 'Modo Exposed: Arquivos Secretos',
    secrets: [
      {
        title: 'Ansiedade detectada',
        description: `${person1} mandou "oi?" 23 vezes quando ${person2} demorou a responder`,
        emoji: '😰',
        revealedData: '23 mensagens de cobrança',
      },
      {
        title: 'Digitando, digitando, digitando...',
        description: `${person2} começou a escrever e parou 156 vezes antes de mandar a mensagem`,
        emoji: '⌨️',
        revealedData: 'Indecisão level: expert',
      },
      {
        title: 'Stalker profissional',
        description: `${person1} visualizou 89% das mensagens em menos de 1 minuto`,
        emoji: '👀',
        revealedData: 'Sempre online',
      },
    ],
    awkwardMoments: [
      {
        date: new Date('2024-05-05'),
        description: 'Aquela briga boba que virou um textão de 287 palavras',
        cringeLevel: 4,
      },
      {
        date: new Date('2024-07-20'),
        description: `${person2} mandou mensagem pra pessoa errada... no grupo de vocês`,
        cringeLevel: 5,
      },
    ],
    patterns: [
      {
        title: 'Vício em checagem',
        description: `${person1} abre a conversa em média 47 vezes por dia`,
        frequency: '47x/dia',
        emoji: '📱',
      },
      {
        title: 'Maratonista de mensagens',
        description: `${person2} manda sequências de 5+ mensagens seguidas`,
        frequency: '34 vezes',
        emoji: '💨',
      },
      {
        title: 'Esquecimento crônico',
        description: `Vocês combinaram de fazer algo e esqueceram 12 vezes`,
        frequency: '12 vezes',
        emoji: '🤦',
      },
    ],
  };
}

/**
 * Gera cards compartilháveis a partir da análise do Gemini
 */
function generateShareableCardsFromAnalysis(person1: string, person2: string, cards: any[], score: number): ShareableCard[] {
  const shareableCards: ShareableCard[] = cards.map(card => ({
    id: `card-${card.id}`,
    type: 'battle-result',
    title: card.title,
    content: {
      headline: card.winner,
      body: card.stat,
    },
    style: {
      gradient: 'fun',
      primaryColor: '#ff6b9d',
      secondaryColor: '#ffa07a',
      emoji: getEmojiForCard(card.id),
    },
    imageUrl: `/cards/${card.id}.png`,
  }));

  // Adicionar card de score no início
  shareableCards.unshift({
    id: 'card-score',
    type: 'compatibility-score',
    title: 'Nosso Score',
    content: {
      headline: `${person1} & ${person2}`,
      body: `${score}% de conexão`,
      footer: 'Nosso Timeline',
    },
    style: {
      gradient: 'romantic',
      primaryColor: '#ff6b9d',
      secondaryColor: '#ffa07a',
      emoji: '💕',
    },
  });

  return shareableCards;
}

function generateMockShareableCards(person1: string, person2: string, score: number): ShareableCard[] {
  return [
    {
      id: 'card-1',
      type: 'compatibility-score',
      title: 'Nosso Score',
      content: {
        headline: `${person1} & ${person2}`,
        body: `${score}% de conexão`,
        footer: 'Nosso Timeline',
      },
      style: {
        gradient: 'romantic',
        primaryColor: '#ff6b9d',
        secondaryColor: '#ffa07a',
        emoji: '💕',
      },
    },
    {
      id: 'card-2',
      type: 'fun-fact',
      title: 'Curiosidade',
      content: {
        headline: 'Você sabia?',
        body: 'Vocês trocaram 247 mensagens em um único dia!',
        footer: 'Nosso Timeline',
      },
      style: {
        gradient: 'fun',
        primaryColor: '#a8edea',
        secondaryColor: '#fed6e3',
        emoji: '🤯',
      },
    },
    {
      id: 'card-3',
      type: 'battle-card',
      title: 'Quem manda mais mensagens?',
      content: {
        headline: 'Batalha dos Tagarelas',
        body: `${person1}: 4.523 vs ${person2}: 4.024`,
        footer: `Vencedor: ${person1} 🏆`,
        data: {
          winner: person1,
        },
      },
      style: {
        gradient: 'dark',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        emoji: '⚔️',
      },
    },
  ];
}

// ==========================================
// UTILITÁRIOS
// ==========================================

function calculateMockCompatibilityScore(relationType: RelationType): number {
  // Gerar um score alto mas não perfeito (85-98%)
  const baseScore = relationType === 'casal' ? 90 : 85;
  const variation = Math.floor(Math.random() * 8);
  return baseScore + variation;
}

function generateUniqueId(): string {
  return `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSlug(person1: string, person2: string): string {
  const normalized1 = person1.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalized2 = person2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const randomId = Math.random().toString(36).substr(2, 6);
  
  return `${normalized1}-${normalized2}-${randomId}`;
}
