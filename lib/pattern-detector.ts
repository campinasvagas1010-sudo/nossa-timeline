import { Message } from '@/types/story';
import { ParsedConversation } from './whatsapp-parser';

/**
 * Métricas brutas extraídas por regex para análise de batalhas
 */
export interface RawBattleMetrics {
  // Métricas de ciúme
  jealousy: {
    person1: JealousyMetrics;
    person2: JealousyMetrics;
  };
  
  // Métricas de conflito/brigas
  conflicts: {
    person1: ConflictMetrics;
    person2: ConflictMetrics;
  };
  
  // Métricas de tempo de resposta (últimos 6 meses)
  responseTime: {
    person1: ResponseTimeMetrics;
    person2: ResponseTimeMetrics;
  };
  
  // Métricas de vácuo/ghosting
  ghosting: {
    person1: GhostingMetrics;
    person2: GhostingMetrics;
  };
  
  // Métricas de orgulho
  pride: {
    person1: PrideMetrics;
    person2: PrideMetrics;
  };
  
  // Mensagens filtradas para GPT (remove irrelevantes)
  filteredMessages: Message[];
  
  // Metadata geral
  metadata: {
    totalMessages: number;
    conversationDays: number;
    analyzedPeriod: string;
    filteredCount: number;
    reductionPercentage: number;
  };
}

export interface JealousyMetrics {
  locationQuestions: number; // "tá onde", "cadê você", "onde você tá"
  companionQuestions: number; // "com quem", "quem tá aí", "tá sozinho"
  timeQuestions: number; // "que horas volta", "quando volta", "vai demorar"
  possessivePhrases: number; // "meu/minha", uso excessivo
  suspiciousTone: number; // "hmmm", "sei", "tá bom então"
  demandingMessages: number; // "me responde", "responde aí"
  doubleTexting: number; // múltiplas msgs sem resposta
  totalScore: number;
}

export interface ConflictMetrics {
  conflictInitiations: number; // primeira msg de tom agressivo
  capsMessages: number; // mensagens em CAPS LOCK
  exclamationOveruse: number; // múltiplos "!!!"
  aggressiveKeywords: number; // "chega", "cansado", "não aguento"
  passiveAggressive: number; // "tá bom então", "tanto faz"
  needToTalk: number; // "precisamos conversar"
  accusations: number; // "você sempre", "você nunca"
  demands: number; // "quero que", "tem que"
  totalScore: number;
}

export interface ResponseTimeMetrics {
  averageResponseMinutes: number;
  longestDelayHours: number;
  messagesIgnored: number; // msgs sem resposta em 24h
  lateNightIgnores: number; // ignoradas à noite
  totalDelayScore: number;
}

export interface GhostingMetrics {
  longestGhostDays: number;
  ghostingEpisodes: number; // >24h sem responder
  averageGhostHours: number;
  messagesBeforeResponse: number; // quantas msgs o outro mandou até responder
  totalGhostScore: number;
}

export interface PrideMetrics {
  shortResponsesAfterFight: number; // "ok", "tá", "hm" pós-conflito
  silentTreatmentHours: number; // tempo sem responder pós-briga
  refusedApologies: number; // não respondeu pedido de desculpas
  coldResponses: number; // respostas secas/monossilábicas
  lastToApologize: number; // quantas vezes não pediu desculpas primeiro
  totalPrideScore: number;
}

/**
 * DETECTOR PRINCIPAL - Analisa conversa completa e extrai todas as métricas
 */
export function detectAllPatterns(conversation: ParsedConversation): RawBattleMetrics {
  const { messages, participants, startDate, endDate } = conversation;
  
  const person1 = participants[0];
  const person2 = participants[1];
  
  console.log('[Pattern Detector] Analisando conversa...');
  console.log(`[Pattern Detector] Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
  console.log(`[Pattern Detector] Total mensagens: ${messages.length}`);
  
  // Calcular período de 6 meses atrás para análise de demora
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Calcular período de 12 meses atrás para análise de orgulho
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  
  // Filtrar mensagens irrelevantes para GPT (ciúme e orgulho)
  const { filterIrrelevantMessages } = require('./whatsapp-parser');
  const filterResult = filterIrrelevantMessages(messages);
  
  console.log(`[Pattern Detector] Mensagens filtradas: ${filterResult.filtered.length}/${filterResult.originalCount} (${filterResult.retentionRate}% mantidas)`);
  console.log(`[Pattern Detector] Redução: ${filterResult.removed} mensagens irrelevantes removidas`);
  
  return {
    jealousy: {
      person1: detectJealousyPatterns(messages, person1),
      person2: detectJealousyPatterns(messages, person2),
    },
    conflicts: {
      person1: detectConflictInitiation(messages, person1),
      person2: detectConflictInitiation(messages, person2),
    },
    responseTime: {
      person1: calculateResponseDelays(messages, person1, person2, sixMonthsAgo),
      person2: calculateResponseDelays(messages, person2, person1, sixMonthsAgo),
    },
    ghosting: {
      person1: detectGhostingGaps(messages, person1, person2),
      person2: detectGhostingGaps(messages, person2, person1),
    },
    pride: {
      person1: detectPridePatterns(messages, person1, person2, twelveMonthsAgo),
      person2: detectPridePatterns(messages, person2, person1, twelveMonthsAgo),
    },
    filteredMessages: filterResult.filtered,
    metadata: {
      totalMessages: messages.length,
      conversationDays: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      analyzedPeriod: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      filteredCount: filterResult.filtered.length,
      reductionPercentage: 100 - filterResult.retentionRate,
    },
  };
}

/**
 * CIÚME - Detecta padrões de comportamento ciumento
 */
function detectJealousyPatterns(messages: Message[], person: string): JealousyMetrics {
  const personMessages = messages.filter(m => m.sender === person);
  
  // Padrões de localização
  const locationPatterns = [
    /t[aá]\s+onde/i,
    /cad[eê]\s+(voc[eê]|vc|tu)/i,
    /onde\s+(voc[eê]|vc|tu)\s+t[aá]/i,
    /onde\s+(voc[eê]|vc|tu)\s+est[aá]/i,
    /aonde\s+(voc[eê]|vc|tu)/i,
    /em\s+qual\s+lugar/i,
  ];
  
  // Padrões de companhia
  const companionPatterns = [
    /com\s+quem/i,
    /quem\s+t[aá]\s+(a[ií]|contigo)/i,
    /t[aá]\s+sozinho/i,
    /t[aá]\s+sozinha/i,
    /quem\s+[eé]\s+esse/i,
    /quem\s+[eé]\s+essa/i,
    /quem\s+foi/i,
  ];
  
  // Padrões de tempo/horário
  const timePatterns = [
    /que\s+horas?\s+volta/i,
    /quando\s+volta/i,
    /vai\s+demorar/i,
    /at[eé]\s+que\s+horas/i,
    /demora\s+muito/i,
    /j[aá]\s+volta/i,
  ];
  
  // Padrões possessivos
  const possessivePatterns = [
    /\bmeu\b/i,
    /\bminha\b/i,
    /s[oó]\s+meu/i,
    /s[oó]\s+minha/i,
  ];
  
  // Tom suspeito
  const suspiciousPatterns = [
    /\bhmmm+\b/i,
    /\bsei\b/i,
    /t[aá]\s+bom\s+ent[aã]o/i,
    /ah\s+[eé]/i,
    /entendi\s*\.{3,}/i,
    /😒|🙄|🤨|🧐/,
  ];
  
  // Demandas de resposta
  const demandingPatterns = [
    /me\s+responde/i,
    /responde\s+(a[ií]|logo)/i,
    /por\s+que\s+n[aã]o\s+responde/i,
    /vai\s+responder/i,
    /me\s+ignora/i,
  ];
  
  let locationQuestions = 0;
  let companionQuestions = 0;
  let timeQuestions = 0;
  let possessivePhrases = 0;
  let suspiciousTone = 0;
  let demandingMessages = 0;
  
  personMessages.forEach(msg => {
    const content = msg.content.toLowerCase();
    
    if (locationPatterns.some(p => p.test(content))) locationQuestions++;
    if (companionPatterns.some(p => p.test(content))) companionQuestions++;
    if (timePatterns.some(p => p.test(content))) timeQuestions++;
    
    // Possessivos excessivos (mais de 2 na mesma mensagem = ciúme)
    const possessiveMatches = content.match(/\b(meu|minha)\b/gi);
    if (possessiveMatches && possessiveMatches.length >= 2) possessivePhrases++;
    
    if (suspiciousPatterns.some(p => p.test(content))) suspiciousTone++;
    if (demandingPatterns.some(p => p.test(content))) demandingMessages++;
  });
  
  // Detectar double texting (múltiplas msgs seguidas sem resposta = insegurança/ciúme)
  let doubleTexting = 0;
  for (let i = 0; i < messages.length - 2; i++) {
    if (
      messages[i].sender === person &&
      messages[i + 1].sender === person &&
      messages[i + 2].sender === person
    ) {
      doubleTexting++;
    }
  }
  
  const totalScore = 
    locationQuestions * 3 +
    companionQuestions * 4 +
    timeQuestions * 2 +
    possessivePhrases * 2 +
    suspiciousTone * 1 +
    demandingMessages * 3 +
    doubleTexting * 2;
  
  return {
    locationQuestions,
    companionQuestions,
    timeQuestions,
    possessivePhrases,
    suspiciousTone,
    demandingMessages,
    doubleTexting,
    totalScore,
  };
}

/**
 * CONFLITO - Detecta quem inicia mais brigas
 */
function detectConflictInitiation(messages: Message[], person: string): ConflictMetrics {
  const personMessages = messages.filter(m => m.sender === person);
  
  // Keywords agressivas
  const aggressiveKeywords = [
    /chega/i,
    /cansei/i,
    /cansado/i,
    /cansada/i,
    /n[aã]o\s+aguento/i,
    /irritado/i,
    /irritada/i,
    /saco/i,
    /droga/i,
    /merda/i,
    /inferno/i,
  ];
  
  // Passivo-agressivo
  const passiveAggressivePatterns = [
    /t[aá]\s+bom\s+ent[aã]o/i,
    /tanto\s+faz/i,
    /faz\s+o\s+que\s+(voc[eê]|vc)\s+quiser/i,
    /problema\s+[eé]\s+seu/i,
    /boa\s+noite\s+ent[aã]o/i,
    /tchau\s+ent[aã]o/i,
    /😒|🙄|😑/,
  ];
  
  // "Precisamos conversar"
  const needToTalkPatterns = [
    /precisamos?\s+conversar/i,
    /preciso\s+falar\s+contigo/i,
    /tenho\s+que\s+falar/i,
    /vamos\s+conversar/i,
  ];
  
  // Acusações
  const accusationPatterns = [
    /voc[eê]\s+sempre/i,
    /voc[eê]\s+nunca/i,
    /vc\s+sempre/i,
    /vc\s+nunca/i,
    /tu\s+sempre/i,
    /tu\s+nunca/i,
  ];
  
  // Demandas
  const demandPatterns = [
    /quero\s+que/i,
    /tem\s+que/i,
    /precisa\s+(fazer|ser|parar)/i,
    /exijo/i,
  ];
  
  let conflictInitiations = 0;
  let capsMessages = 0;
  let exclamationOveruse = 0;
  let aggressiveKeywordsCount = 0;
  let passiveAggressive = 0;
  let needToTalk = 0;
  let accusations = 0;
  let demands = 0;
  
  // Detectar início de conflito (primeira msg agressiva após período calmo)
  for (let i = 0; i < messages.length - 1; i++) {
    const msg = messages[i];
    if (msg.sender !== person) continue;
    
    const content = msg.content;
    const isAggressive = 
      aggressiveKeywords.some(p => p.test(content)) ||
      content === content.toUpperCase() && content.length > 10 ||
      (content.match(/!/g) || []).length >= 3 ||
      passiveAggressivePatterns.some(p => p.test(content));
    
    if (isAggressive) {
      // Verificar se é início (msg anterior não era agressiva)
      if (i === 0 || messages[i - 1].sender !== person) {
        conflictInitiations++;
      }
    }
  }
  
  personMessages.forEach(msg => {
    const content = msg.content;
    
    // CAPS (mensagem toda em maiúsculas com mais de 10 caracteres)
    if (content === content.toUpperCase() && content.length > 10 && /[A-Z]{10,}/.test(content)) {
      capsMessages++;
    }
    
    // Exclamações excessivas
    const exclamations = (content.match(/!/g) || []).length;
    if (exclamations >= 3) exclamationOveruse++;
    
    if (aggressiveKeywords.some(p => p.test(content))) aggressiveKeywordsCount++;
    if (passiveAggressivePatterns.some(p => p.test(content))) passiveAggressive++;
    if (needToTalkPatterns.some(p => p.test(content))) needToTalk++;
    if (accusationPatterns.some(p => p.test(content))) accusations++;
    if (demandPatterns.some(p => p.test(content))) demands++;
  });
  
  const totalScore = 
    conflictInitiations * 5 +
    capsMessages * 3 +
    exclamationOveruse * 2 +
    aggressiveKeywordsCount * 3 +
    passiveAggressive * 4 +
    needToTalk * 5 +
    accusations * 4 +
    demands * 3;
  
  return {
    conflictInitiations,
    capsMessages,
    exclamationOveruse,
    aggressiveKeywords: aggressiveKeywordsCount,
    passiveAggressive,
    needToTalk,
    accusations,
    demands,
    totalScore,
  };
}

/**
 * TEMPO DE RESPOSTA - Calcula demora para responder (últimos 6 meses)
 */
function calculateResponseDelays(
  messages: Message[],
  person: string,
  otherPerson: string,
  sixMonthsAgo: Date
): ResponseTimeMetrics {
  // Filtrar mensagens dos últimos 6 meses
  const recentMessages = messages.filter(m => m.timestamp >= sixMonthsAgo);
  
  const delays: number[] = [];
  let messagesIgnored = 0;
  let lateNightIgnores = 0;
  let longestDelayHours = 0;
  
  for (let i = 0; i < recentMessages.length - 1; i++) {
    const currentMsg = recentMessages[i];
    const nextMsg = recentMessages[i + 1];
    
    // Se a outra pessoa mandou msg e esta pessoa respondeu
    if (currentMsg.sender === otherPerson && nextMsg.sender === person) {
      const delayMs = nextMsg.timestamp.getTime() - currentMsg.timestamp.getTime();
      const delayMinutes = delayMs / (1000 * 60);
      const delayHours = delayMinutes / 60;
      
      delays.push(delayMinutes);
      
      if (delayHours > longestDelayHours) {
        longestDelayHours = delayHours;
      }
      
      // Ignorada por mais de 24h
      if (delayHours >= 24) {
        messagesIgnored++;
      }
      
      // Ignorada à noite (23h-7h)
      const hour = currentMsg.timestamp.getHours();
      if ((hour >= 23 || hour <= 7) && delayHours >= 6) {
        lateNightIgnores++;
      }
    }
  }
  
  const averageResponseMinutes = delays.length > 0 
    ? delays.reduce((a, b) => a + b, 0) / delays.length 
    : 0;
  
  const totalDelayScore = 
    averageResponseMinutes * 0.5 +
    longestDelayHours * 10 +
    messagesIgnored * 50 +
    lateNightIgnores * 30;
  
  return {
    averageResponseMinutes: Math.round(averageResponseMinutes),
    longestDelayHours: Math.round(longestDelayHours * 10) / 10,
    messagesIgnored,
    lateNightIgnores,
    totalDelayScore: Math.round(totalDelayScore),
  };
}

/**
 * VÁCUO/GHOSTING - Detecta quem deixa mais no vácuo
 */
function detectGhostingGaps(
  messages: Message[],
  person: string,
  otherPerson: string
): GhostingMetrics {
  let longestGhostDays = 0;
  let ghostingEpisodes = 0;
  const ghostHours: number[] = [];
  let messagesBeforeResponse = 0;
  
  for (let i = 0; i < messages.length - 1; i++) {
    const currentMsg = messages[i];
    
    // Se a outra pessoa mandou msg
    if (currentMsg.sender === otherPerson) {
      // Contar quantas msgs a outra pessoa mandou antes desta pessoa responder
      let consecutiveMsgs = 1;
      let j = i + 1;
      
      while (j < messages.length && messages[j].sender === otherPerson) {
        consecutiveMsgs++;
        j++;
      }
      
      if (j < messages.length && messages[j].sender === person) {
        const delayMs = messages[j].timestamp.getTime() - currentMsg.timestamp.getTime();
        const delayHours = delayMs / (1000 * 60 * 60);
        const delayDays = delayHours / 24;
        
        // Ghosting = mais de 24h sem responder
        if (delayHours >= 24) {
          ghostingEpisodes++;
          ghostHours.push(delayHours);
          
          if (delayDays > longestGhostDays) {
            longestGhostDays = delayDays;
          }
          
          messagesBeforeResponse += consecutiveMsgs;
        }
      }
    }
  }
  
  const averageGhostHours = ghostHours.length > 0
    ? ghostHours.reduce((a, b) => a + b, 0) / ghostHours.length
    : 0;
  
  const totalGhostScore = 
    longestGhostDays * 100 +
    ghostingEpisodes * 50 +
    averageGhostHours * 5 +
    messagesBeforeResponse * 10;
  
  return {
    longestGhostDays: Math.round(longestGhostDays * 10) / 10,
    ghostingEpisodes,
    averageGhostHours: Math.round(averageGhostHours * 10) / 10,
    messagesBeforeResponse,
    totalGhostScore: Math.round(totalGhostScore),
  };
}

/**
 * ORGULHO - Detecta comportamento orgulhoso (últimos 12 meses)
 */
function detectPridePatterns(
  messages: Message[],
  person: string,
  otherPerson: string,
  twelveMonthsAgo: Date
): PrideMetrics {
  // Filtrar mensagens dos últimos 12 meses
  const recentMessages = messages.filter(m => m.timestamp >= twelveMonthsAgo);
  
  // Respostas curtas/secas
  const shortResponsePatterns = [
    /^(ok|okay)$/i,
    /^(t[aá]|ta)$/i,
    /^(hm|hmm)$/i,
    /^(sim|ss)$/i,
    /^(n[aã]o|nn)$/i,
    /^(tanto\s+faz)$/i,
    /^\.{3,}$/,
  ];
  
  // Pedidos de desculpa
  const apologyPatterns = [
    /desculpa/i,
    /me\s+perdoa/i,
    /perd[aã]o/i,
    /foi\s+mal/i,
    /me\s+desculpa/i,
    /sinto\s+muito/i,
  ];
  
  let shortResponsesAfterFight = 0;
  let silentTreatmentHours = 0;
  let refusedApologies = 0;
  let coldResponses = 0;
  let lastToApologize = 0;
  
  // Detectar contexto pós-conflito
  let inConflict = false;
  let conflictStartIndex = -1;
  
  for (let i = 0; i < recentMessages.length; i++) {
    const msg = recentMessages[i];
    const content = msg.content.toLowerCase();
    
    // Detectar início de conflito
    const isConflictMessage = 
      content === content.toUpperCase() && content.length > 10 ||
      (content.match(/!/g) || []).length >= 3 ||
      /chega|cansei|n[aã]o aguento|saco/i.test(content);
    
    if (isConflictMessage) {
      inConflict = true;
      conflictStartIndex = i;
    }
    
    // Analisar comportamento durante conflito
    if (inConflict && msg.sender === person) {
      // Resposta seca pós-conflito
      if (shortResponsePatterns.some(p => p.test(content))) {
        shortResponsesAfterFight++;
      }
      
      // Resposta fria (menos de 10 caracteres após conflito)
      if (content.length <= 10 && !content.includes('❤') && !content.includes('💕')) {
        coldResponses++;
      }
      
      // Se a outra pessoa pediu desculpas
      if (i > 0 && recentMessages[i - 1].sender === otherPerson) {
        const prevContent = recentMessages[i - 1].content;
        if (apologyPatterns.some(p => p.test(prevContent))) {
          // Se não aceitou as desculpas (resposta seca ou ignora)
          if (shortResponsePatterns.some(p => p.test(content)) || content.length <= 5) {
            refusedApologies++;
          }
        }
      }
      
      // Detectar silent treatment (demora muito pra responder após conflito)
      if (i > conflictStartIndex) {
        const prevMsg = recentMessages[i - 1];
        if (prevMsg.sender === otherPerson) {
          const silentMs = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
          const silentHrs = silentMs / (1000 * 60 * 60);
          if (silentHrs >= 6) {
            silentTreatmentHours += silentHrs;
          }
        }
      }
    }
    
    // Detectar fim do conflito (mensagens normais voltaram)
    if (inConflict && i > conflictStartIndex + 5) {
      const lastMsgs = recentMessages.slice(i - 3, i);
      const normalMsgs = lastMsgs.filter(m => 
        m.content.length > 20 && 
        !shortResponsePatterns.some(p => p.test(m.content))
      );
      
      if (normalMsgs.length >= 2) {
        // Verificar quem pediu desculpas primeiro
        const conflictMsgs = recentMessages.slice(conflictStartIndex, i);
        const personApology = conflictMsgs.find(m => 
          m.sender === person && apologyPatterns.some(p => p.test(m.content))
        );
        const otherApology = conflictMsgs.find(m => 
          m.sender === otherPerson && apologyPatterns.some(p => p.test(m.content))
        );
        
        // Se a outra pessoa pediu desculpas primeiro (ou esta pessoa não pediu)
        if (otherApology && !personApology) {
          lastToApologize++;
        }
        
        inConflict = false;
      }
    }
  }
  
  const totalPrideScore = 
    shortResponsesAfterFight * 10 +
    silentTreatmentHours * 5 +
    refusedApologies * 20 +
    coldResponses * 8 +
    lastToApologize * 30;
  
  return {
    shortResponsesAfterFight,
    silentTreatmentHours: Math.round(silentTreatmentHours),
    refusedApologies,
    coldResponses,
    lastToApologize,
    totalPrideScore: Math.round(totalPrideScore),
  };
}
