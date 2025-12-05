import { Message } from '@/types/story';
import { RawBattleMetrics } from './pattern-detector';

/**
 * Resultado de batalha interpretado pela IA
 */
export interface BattleResult {
  category: 'ciume' | 'brigas' | 'demora' | 'vacuo' | 'orgulho';
  winner: string;
  loser: string;
  confidence: number; // 0-100
  result: string; // Descrição viral para o card
  evidence: string[]; // Provas específicas
  funnyComment?: string;
  cardImage?: string; // Caminho para o card PNG em /public/cards/
}

// Mapear categorias para arquivos de card
export const BATTLE_CARD_IMAGES: Record<string, string> = {
  ciume: '/cards/ciume.png',
  brigas: '/cards/brigas.png',
  demora: '/cards/demora.png',
  vacuo: '/cards/vacuo.png',
  orgulho: '/cards/orgulho.png',
};

/**
 * Prepara mensagens filtradas + contexto de métricas para GPT
 * Formato otimizado para reduzir tokens
 */
export function prepareMessagesForGPT(
  filteredMessages: Message[],
  metrics: RawBattleMetrics,
  battleType: 'ciume' | 'orgulho'
): string {
  const person1 = filteredMessages[0]?.sender || 'Person1';
  const person2 = filteredMessages.find(m => m.sender !== person1)?.sender || 'Person2';
  
  if (battleType === 'ciume') {
    const p1Jealousy = metrics.jealousy.person1;
    const p2Jealousy = metrics.jealousy.person2;
    
    return `
# ANÁLISE DE CIÚME - Conversa WhatsApp

## CONTEXTO (Regex detectou):
- ${person1}: ${p1Jealousy.locationQuestions} perguntas de localização, ${p1Jealousy.companionQuestions} perguntas sobre companhia, ${p1Jealousy.suspiciousTone} tons suspeitos
- ${person2}: ${p2Jealousy.locationQuestions} perguntas de localização, ${p2Jealousy.companionQuestions} perguntas sobre companhia, ${p2Jealousy.suspiciousTone} tons suspeitos

## MENSAGENS RELEVANTES (Filtradas):
${filteredMessages.slice(0, 300).map(m => `[${m.timestamp.toLocaleString()}] ${m.sender}: ${m.content}`).join('\n')}

TAREFA: Analise quem demonstra MAIS CIÚME. Considere:
1. Insegurança e possessividade nas mensagens
2. Frequência de perguntas sobre localização/companhia
3. Tom de desconfiança e cobrança emocional
4. Contexto emocional das conversas

Responda em JSON:
{
  "winner": "${person1}" ou "${person2}",
  "confidence": 0-100,
  "result": "descrição viral para Instagram Stories",
  "evidence": ["prova 1", "prova 2", "prova 3"]
}
`;
  }
  
  if (battleType === 'orgulho') {
    const p1Pride = metrics.pride.person1;
    const p2Pride = metrics.pride.person2;
    
    return `
# ANÁLISE DE ORGULHO - Conversa WhatsApp

## CONTEXTO (Regex detectou):
- ${person1}: ${p1Pride.silentTreatmentHours.toFixed(1)}h de silêncio pós-briga, ${p1Pride.refusedApologies} desculpas ignoradas, ${p1Pride.coldResponses} respostas frias
- ${person2}: ${p2Pride.silentTreatmentHours.toFixed(1)}h de silêncio pós-briga, ${p2Pride.refusedApologies} desculpas ignoradas, ${p2Pride.coldResponses} respostas frias

## MENSAGENS RELEVANTES (Filtradas - Pós-conflito):
${filteredMessages.slice(0, 200).map(m => `[${m.timestamp.toLocaleString()}] ${m.sender}: ${m.content}`).join('\n')}

TAREFA: Analise quem tem MAIS ORGULHO. Considere:
1. Quem demora mais para fazer as pazes após brigas
2. Respostas secas/frias após conflitos
3. Recusa em pedir desculpas primeiro
4. Silent treatment e distanciamento emocional

Responda em JSON:
{
  "winner": "${person1}" ou "${person2}",
  "confidence": 0-100,
  "result": "descrição viral para Instagram Stories",
  "evidence": ["prova 1", "prova 2", "prova 3"]
}
`;
  }
  
  return '';
}

/**
 * Interpreta todos os resultados de batalha
 * - Ciúme e Orgulho: usa GPT-4 com mensagens filtradas
 * - Vácuo, Demora, Brigas: usa apenas regex (não precisa GPT)
 */
export async function interpretBattleResults(
  metrics: RawBattleMetrics,
  participants: string[]
): Promise<BattleResult[]> {
  const [person1, person2] = participants;
  const results: BattleResult[] = [];
  
  console.log('[AI Interpreter] Interpretando resultados de batalha...');
  
  // 1. VÁCUO - Apenas regex (95% precision)
  const ghostingWinner = metrics.ghosting.person1.totalGhostScore > metrics.ghosting.person2.totalGhostScore ? person1 : person2;
  const ghostingLoser = ghostingWinner === person1 ? person2 : person1;
  const ghostingMetrics = ghostingWinner === person1 ? metrics.ghosting.person1 : metrics.ghosting.person2;
  
  results.push({
    category: 'vacuo',
    winner: ghostingWinner,
    loser: ghostingLoser,
    confidence: 95,
    result: `Deixou no vácuo por ${ghostingMetrics.longestGhostDays} dias`,
    evidence: [
      `${ghostingMetrics.ghostingEpisodes} episódios de ghosting`,
      `Média de ${ghostingMetrics.averageGhostHours.toFixed(1)}h sem responder`,
      `${ghostingMetrics.messagesBeforeResponse} mensagens ignoradas seguidas`,
    ],
    funnyComment: '👻 Rei/Rainha do Vácuo',
    cardImage: BATTLE_CARD_IMAGES.vacuo,
  });
  
  // 2. DEMORA - Apenas regex (95% precision)
  const delayWinner = metrics.responseTime.person1.totalDelayScore > metrics.responseTime.person2.totalDelayScore ? person1 : person2;
  const delayLoser = delayWinner === person1 ? person2 : person1;
  const delayMetrics = delayWinner === person1 ? metrics.responseTime.person1 : metrics.responseTime.person2;
  
  results.push({
    category: 'demora',
    winner: delayWinner,
    loser: delayLoser,
    confidence: 95,
    result: `Demora em média ${delayMetrics.averageResponseMinutes}min para responder`,
    evidence: [
      `Recorde: ${delayMetrics.longestDelayHours.toFixed(1)}h sem responder`,
      `${delayMetrics.messagesIgnored} mensagens ignoradas 24h+`,
      `${delayMetrics.lateNightIgnores} mensagens à noite ignoradas`,
    ],
    funnyComment: '⏰ Campeão(ã) da Demora',
    cardImage: BATTLE_CARD_IMAGES.demora,
  });
  
  // 3. BRIGAS - Apenas regex (80% precision)
  const conflictWinner = metrics.conflicts.person1.totalScore > metrics.conflicts.person2.totalScore ? person1 : person2;
  const conflictLoser = conflictWinner === person1 ? person2 : person1;
  const conflictMetrics = conflictWinner === person1 ? metrics.conflicts.person1 : metrics.conflicts.person2;
  
  results.push({
    category: 'brigas',
    winner: conflictWinner,
    loser: conflictLoser,
    confidence: 80,
    result: `Iniciou ${conflictMetrics.conflictInitiations} brigas`,
    evidence: [
      `${conflictMetrics.capsMessages} mensagens em CAPS`,
      `${conflictMetrics.aggressiveKeywords} palavras agressivas usadas`,
      `${conflictMetrics.passiveAggressive} mensagens passivo-agressivas`,
    ],
    funnyComment: '🔥 Iniciador(a) Oficial de DR',
    cardImage: BATTLE_CARD_IMAGES.brigas,
  });
  
  // 4. CIÚME - Requer GPT-4 (85% precision com filtro)
  try {
    const jealousyPrompt = prepareMessagesForGPT(metrics.filteredMessages, metrics, 'ciume');
    const jealousyResult = await callGPT4(jealousyPrompt, 'ciume');
    if (jealousyResult && jealousyResult.confidence >= 30) {
      results.push(jealousyResult);
    }
  } catch (error) {
    console.error('[AI Interpreter] Erro ao analisar ciúme:', error);
    // Fallback para regex se GPT falhar
    const jealousyWinner = metrics.jealousy.person1.totalScore > metrics.jealousy.person2.totalScore ? person1 : person2;
    const jealousyLoser = jealousyWinner === person1 ? person2 : person1;
    const jealousyMetrics = jealousyWinner === person1 ? metrics.jealousy.person1 : metrics.jealousy.person2;
    
    results.push({
      category: 'ciume',
      winner: jealousyWinner,
      loser: jealousyLoser,
      confidence: 40, // Baixa confidence (regex apenas)
      result: `${jealousyMetrics.locationQuestions + jealousyMetrics.companionQuestions} perguntas suspeitas`,
      evidence: [
        `${jealousyMetrics.locationQuestions} "tá onde?"`,
        `${jealousyMetrics.companionQuestions} "com quem?"`,
        `${jealousyMetrics.suspiciousTone} tons de desconfiança`,
      ],
      cardImage: BATTLE_CARD_IMAGES.ciume,
    });
  }
  
  // 5. ORGULHO - Requer GPT-4 (85% precision com filtro)
  try {
    const pridePrompt = prepareMessagesForGPT(metrics.filteredMessages, metrics, 'orgulho');
    const prideResult = await callGPT4(pridePrompt, 'orgulho');
    if (prideResult && prideResult.confidence >= 30) {
      results.push(prideResult);
    }
  } catch (error) {
    console.error('[AI Interpreter] Erro ao analisar orgulho:', error);
    // Fallback para regex se GPT falhar
    const prideWinner = metrics.pride.person1.totalPrideScore > metrics.pride.person2.totalPrideScore ? person1 : person2;
    const prideLoser = prideWinner === person1 ? person2 : person1;
    const prideMetrics = prideWinner === person1 ? metrics.pride.person1 : metrics.pride.person2;
    
    results.push({
      category: 'orgulho',
      winner: prideWinner,
      loser: prideLoser,
      confidence: 40, // Baixa confidence (regex apenas)
      result: `${prideMetrics.silentTreatmentHours.toFixed(1)}h de silêncio após brigas`,
      evidence: [
        `${prideMetrics.refusedApologies} desculpas ignoradas`,
        `${prideMetrics.coldResponses} respostas frias`,
        `${prideMetrics.lastToApologize} vezes não pediu desculpas primeiro`,
      ],
      cardImage: BATTLE_CARD_IMAGES.orgulho,
    });
  }
  
  // Filtrar resultados com confidence < 30%
  const filtered = results.filter(r => r.confidence >= 30);
  
  console.log(`[AI Interpreter] ${filtered.length}/${results.length} batalhas com confidence >= 30%`);
  
  return filtered;
}

/**
 * Chama Gemini 1.5 Flash para análise de batalhas
 */
async function callGPT4(prompt: string, battleType: string): Promise<BattleResult | null> {
  try {
    const { analyzeWithGemini } = await import('./gemini-service');
    
    console.log(`[Gemini] Analisando ${battleType}...`);
    const result = await analyzeWithGemini(prompt);
    
    return {
      category: battleType,
      winner: result.winner,
      winnerPhoto: '', // Será preenchido depois
      stat: `${result.confidence}%`,
      statLabel: '',
      result: result.result,
      evidence: result.evidence || [],
      confidence: result.confidence,
      details: [],
      placar: { pedro: 0, ana: 0 },
      cardImage: battleType === 'ciume' ? BATTLE_CARD_IMAGES.ciume : BATTLE_CARD_IMAGES.orgulho,
    };
  } catch (error) {
    console.error(`[Gemini] Erro ao analisar ${battleType}:`, error);
    return null;
  }
}
