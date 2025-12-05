import { NextRequest, NextResponse } from 'next/server';
import { parseWhatsAppConversation, validateConversationSize, filterIrrelevantMessages } from '@/lib/whatsapp-parser';
import { analyzeWithGemini } from '@/lib/gemini-service';

/**
 * Endpoint principal de análise de conversas
 * POST /api/analyze
 * 
 * Recebe: arquivo .txt da conversa do WhatsApp
 * Retorna: 15 batalhas analisadas + estatísticas
 */

export const maxDuration = 60; // 60 segundos max

interface BattleCategory {
  id: string;
  name: string;
  question: string;
  keywords: string[];
}

// 15 categorias de batalha
const BATTLE_CATEGORIES: BattleCategory[] = [
  {
    id: 'ciume',
    name: 'Mais Ciumento(a)',
    question: 'Quem demonstrou mais ciúmes na conversa?',
    keywords: ['ciúme', 'ciume', 'com quem', 'onde você', 'quem é', 'sozinho', 'sozinha'],
  },
  {
    id: 'carinhoso',
    name: 'Mais Carinhoso(a)',
    question: 'Quem foi mais carinhoso(a) e demonstrou mais afeto?',
    keywords: ['amor', 'amo', 'te amo', 'linda', 'lindo', 'fofo', 'fofa', 'querido', 'querida'],
  },
  {
    id: 'demora',
    name: 'Mais Demorado(a) pra Responder',
    question: 'Quem demorava mais para responder as mensagens?',
    keywords: ['demora', 'demorou', 'responde', 'me responde', 'cadê você', 'sumiu'],
  },
  {
    id: 'vacuo',
    name: 'Deu Mais Vácuo',
    question: 'Quem deixou o outro sem resposta mais vezes?',
    keywords: ['responde', 'me responde', 'tá aí', 'viu', 'visualizou', 'online'],
  },
  {
    id: 'orgulhoso',
    name: 'Mais Orgulhoso(a)',
    question: 'Quem tinha mais dificuldade em pedir desculpas ou admitir erros?',
    keywords: ['orgulho', 'desculpa', 'perdão', 'erro', 'culpa', 'razão', 'teimosia'],
  },
  {
    id: 'dr',
    name: 'Começou Mais DR',
    question: 'Quem iniciou mais discussões ou conflitos?',
    keywords: ['preciso falar', 'conversamos', 'chateado', 'chateada', 'briga', 'discussão'],
  },
  {
    id: 'reconciliacao',
    name: 'Fez as Pazes Primeiro',
    question: 'Quem tomava mais iniciativa para fazer as pazes?',
    keywords: ['desculpa', 'me perdoa', 'sinto muito', 'não briga', 'faz as pazes'],
  },
  {
    id: 'romantico',
    name: 'Mais Romântico(a)',
    question: 'Quem fazia mais declarações românticas?',
    keywords: ['te amo', 'meu amor', 'minha vida', 'feliz', 'sortudo', 'sortuda', 'especial'],
  },
  {
    id: 'engracado',
    name: 'Mais Engraçado(a)',
    question: 'Quem fazia o outro rir mais?',
    keywords: ['kkkk', 'kkkkk', 'hahaha', 'risos', 'mds', 'socorro', 'morto'],
  },
  {
    id: 'preocupado',
    name: 'Mais Preocupado(a)',
    question: 'Quem demonstrava mais preocupação com o outro?',
    keywords: ['tá bem', 'está bem', 'cuidado', 'preocupado', 'preocupada', 'tudo bem'],
  },
  {
    id: 'saudade',
    name: 'Sentiu Mais Saudade',
    question: 'Quem expressava mais saudades?',
    keywords: ['saudade', 'sdd', 'miss', 'falta', 'queria estar', 'quero te ver'],
  },
  {
    id: 'grudento',
    name: 'Mais Grudento(a)',
    question: 'Quem buscava mais atenção constante?',
    keywords: ['amor', 'oi', 'cadê', 'tá aí', 'me responde', 'atenção'],
  },
  {
    id: 'planejador',
    name: 'Planejou Mais Encontros',
    question: 'Quem tomava mais iniciativa para marcar encontros?',
    keywords: ['vamos', 'podemos', 'encontro', 'sair', 'jantar', 'cinema', 'viagem'],
  },
  {
    id: 'complimento',
    name: 'Fez Mais Elogios',
    question: 'Quem elogiava mais o parceiro?',
    keywords: ['lindo', 'linda', 'gato', 'gata', 'perfeito', 'perfeita', 'maravilhoso'],
  },
  {
    id: 'emoji',
    name: 'Usou Mais Emoji',
    question: 'Quem usava mais emojis nas conversas?',
    keywords: ['❤️', '😍', '😘', '🥰', '💕', '😊', '😂', '🤣'],
  },
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 400 }
      );
    }
    
    console.log('[Analyze] Arquivo recebido:', file.name, file.size, 'bytes');
    
    // Ler conteúdo do arquivo
    const fileContent = await file.text();
    
    // 1. Parse da conversa
    console.log('[Analyze] Iniciando parsing...');
    const conversation = parseWhatsAppConversation(fileContent);
    
    // 2. Validar tamanho
    console.log('[Analyze] Validando tamanho...');
    const validation = validateConversationSize(conversation);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: validation.warnings[0],
          validation 
        },
        { status: 400 }
      );
    }
    
    // 3. Filtrar mensagens irrelevantes
    console.log('[Analyze] Filtrando mensagens irrelevantes...');
    const { filtered, removed, retentionRate } = filterIrrelevantMessages(conversation.messages);
    
    console.log(`[Analyze] Filtro: ${conversation.totalMessages} → ${filtered.length} (${retentionRate}% mantidas)`);
    
    // 4. Analisar cada categoria com Gemini
    console.log('[Analyze] Iniciando análise das batalhas...');
    const battles: any[] = [];
    
    for (const category of BATTLE_CATEGORIES) {
      console.log(`[Analyze] Analisando: ${category.name}...`);
      
      try {
        // Preparar contexto para análise
        const context = `Participantes: ${conversation.participants.join(' e ')}
Período: ${conversation.startDate.toLocaleDateString('pt-BR')} a ${conversation.endDate.toLocaleDateString('pt-BR')}
Total de mensagens: ${filtered.length}

Últimas 50 mensagens relevantes:
${filtered.slice(-50).map(m => `[${m.timestamp.toLocaleString('pt-BR')}] ${m.sender}: ${m.content}`).join('\n')}`;
        
        const result = await analyzeWithGemini(
          `${category.question}\n\nContexto:\n${context}`
        );
        
        battles.push({
          category: category.id,
          name: category.name,
          winner: result.winner,
          confidence: result.confidence,
          result: result.result,
          evidence: result.evidence,
        });
        
        console.log(`[Analyze] ✅ ${category.name}: ${result.winner} (${result.confidence}%)`);
        
        // Delay de 2 segundos entre requests para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error: any) {
        console.error(`[Analyze] ❌ Erro em ${category.name}:`, error.message);
        
        // Se for rate limit, pausar por 60 segundos
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          console.log('[Analyze] Rate limit detectado, aguardando 60s...');
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          // Tentar novamente
          try {
            const result = await analyzeWithGemini(
              `${category.question}\n\nContexto:\n${context}`
            );
            
            battles.push({
              category: category.id,
              name: category.name,
              winner: result.winner,
              confidence: result.confidence,
              result: result.result,
              evidence: result.evidence,
            });
          } catch (retryError: any) {
            console.error(`[Analyze] ❌ Falha no retry:`, retryError.message);
            battles.push({
              category: category.id,
              name: category.name,
              error: 'Análise temporariamente indisponível',
            });
          }
        } else {
          battles.push({
            category: category.id,
            name: category.name,
            error: error.message,
          });
        }
      }
    }
    
    console.log(`[Analyze] ✅ Análise completa: ${battles.length} batalhas`);
    
    // 5. Retornar resultado
    return NextResponse.json({
      success: true,
      conversation: {
        participants: conversation.participants,
        startDate: conversation.startDate,
        endDate: conversation.endDate,
        totalMessages: conversation.totalMessages,
        filteredMessages: filtered.length,
        retentionRate,
      },
      battles,
      validation,
    });
    
  } catch (error: any) {
    console.error('[Analyze] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar conversa' },
      { status: 500 }
    );
  }
}
