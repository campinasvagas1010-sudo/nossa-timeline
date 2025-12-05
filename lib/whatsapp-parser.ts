import { Message } from '@/types/story';

/**
 * Parser de conversa do WhatsApp exportada em formato .txt
 * 
 * Formato esperado:
 * [DD/MM/YYYY HH:MM:SS] Nome: Mensagem
 * ou
 * DD/MM/YYYY, HH:MM - Nome: Mensagem
 * 
 * TODO: Implementar parsing real quando integrar com OpenAI
 * Por enquanto, retorna dados mock para desenvolvimento
 */

export interface ParsedConversation {
  messages: Message[];
  participants: string[];
  startDate: Date;
  endDate: Date;
  totalMessages: number;
}

export interface ConversationValidation {
  tier: 'free' | 'premium';
  messageCount: number;
  estimatedCost: number;
  isValid: boolean;
  warnings: string[];
}

export interface FilteredMessages {
  filtered: Message[];
  removed: number;
  retentionRate: number;
  originalCount: number;
}

export function parseWhatsAppConversation(fileContent: string): ParsedConversation {
  console.log('[WhatsApp Parser] Iniciando parsing universal...');
  console.log('[WhatsApp Parser] Tamanho do arquivo:', fileContent.length, 'caracteres');
  
  const messages: Message[] = [];
  // Suportar \r\n (Windows), \n (Unix) e \r (Mac antigo)
  const lines = fileContent.split(/\r\n|\r|\n/);
  
  // Padrões universais de WhatsApp (suporta múltiplos formatos)
  const patterns = [
    // Brasileiro: [04/01/2021, 07:54:21] Nome: mensagem
    /\[(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2})\] (.+?): (.*)/,
    
    // Sem segundos: [04/01/2021, 07:54] Nome: mensagem  
    /\[(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})\] (.+?): (.*)/,
    
    // iOS sem vírgula: [29/12/2020 10:57:43] Nome: mensagem
    /\[(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})\] (.+?): (.*)/,
    
    // Android: 29/12/2020, 10:57 - Nome: mensagem
    /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})(?::(\d{2}))? - (.+?): (.*)/,
    
    // Americano: [12/29/2020, 10:57:43 AM] Nome: mensagem
    /\[(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)\] (.+?): (.*)/,
    
    // Europeu: [29.12.2020, 10:57:43] Nome: mensagem
    /\[(\d{1,2})\.(\d{1,2})\.(\d{4}), (\d{1,2}):(\d{2}):(\d{2})\] (.+?): (.*)/,
  ];
  
  let currentMessage: Message | null = null;
  let messageId = 0;
  let successfulParses = 0;
  

  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    let matched = false;
    
    // Tentar cada padrão até encontrar match
    for (let patternIdx = 0; patternIdx < patterns.length; patternIdx++) {
      const pattern = patterns[patternIdx];
      const match = line.match(pattern);
      
      if (match) {
        matched = true;
        
        // Salvar mensagem anterior se existir
        if (currentMessage) {
          messages.push(currentMessage);
        }
        
        // Extrair partes - novo formato simplificado
        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = parseInt(match[3]);
        let hour = parseInt(match[4]);
        const minute = parseInt(match[5]);
        let second = 0;
        let sender = '';
        let content = '';
        
        // Verificar se tem segundos ou AM/PM
        if (match.length === 9 && !match[6].match(/AM|PM/)) {
          // [04/01/2021, 07:54:21] Nome: msg
          second = parseInt(match[6]);
          sender = match[7];
          content = match[8];
        } else if (match.length === 8) {
          // [04/01/2021, 07:54] Nome: msg
          sender = match[6];
          content = match[7];
        } else if (match[6] && match[6].match(/AM|PM/)) {
          // [12/29/2020, 10:57:43 AM] Nome: msg
          second = parseInt(match[5] || '0');
          const ampm = match[6];
          if (ampm === 'PM' && hour < 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          sender = match[7];
          content = match[8];
        } else {
          // Fallback
          second = parseInt(match[6] || '0');
          sender = match[7] || '';
          content = match[8] || '';
        }
        
        // Criar nova mensagem
        currentMessage = {
          id: String(++messageId),
          timestamp: new Date(year, month - 1, day, hour, minute, second),
          sender: sender.trim(),
          content: content.trim(),
          type: 'text',
        };
        
        successfulParses++;
        break;
      }
    }
    
    // Se não matchou nenhum padrão e há mensagem atual, é continuação
    if (!matched && currentMessage) {
      currentMessage.content += '\n' + line;
    }
  }
  
  // Adicionar última mensagem
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  console.log(`[WhatsApp Parser] ${successfulParses} mensagens parseadas`);
  
  if (messages.length === 0) {
    console.error('[WhatsApp Parser] Primeiras 3 linhas do arquivo:');
    lines.slice(0, 3).forEach((line, idx) => console.error(`  ${idx + 1}: ${line}`));
    throw new Error('Nenhuma mensagem foi encontrada no arquivo. Verifique o formato de exportação do WhatsApp.');
  }
  
  // Extrair participantes únicos
  const participants = Array.from(new Set(messages.map(m => m.sender)));
  
  if (participants.length < 2) {
    throw new Error('A conversa precisa ter pelo menos 2 participantes');
  }
  
  // Detectar mensagens de mídia
  messages.forEach(msg => {
    const content = msg.content.toLowerCase();
    if (
      content.includes('<anexado:') ||
      content.includes('imagem omitida') ||
      content.includes('vídeo omitido') ||
      content.includes('áudio omitido') ||
      content.includes('documento omitido') ||
      content.includes('sticker omitido')
    ) {
      msg.type = 'media';
    }
  });
  
  // Calcular range de datas
  const timestamps = messages.map(m => m.timestamp.getTime());
  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps));
  
  console.log(`[WhatsApp Parser] ✅ ${messages.length} mensagens parseadas`);
  console.log(`[WhatsApp Parser] Participantes: ${participants.join(', ')}`);
  console.log(`[WhatsApp Parser] Período: ${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`);
  
  return {
    messages,
    participants,
    startDate,
    endDate,
    totalMessages: messages.length,
  };
}

/**
 * Extrai participantes únicos da conversa e identifica se são nomes ou números
 */
export interface ParticipantInfo {
  name: string;
  isPhoneNumber: boolean;
  displayName: string;
}

export function extractParticipants(messages: Message[]): ParticipantInfo[] {
  const uniqueParticipants = Array.from(new Set(messages.map(m => m.sender)));
  
  return uniqueParticipants.map(participant => {
    // Detectar se é número de telefone (contém +, dígitos e espaços/hífens)
    const isPhoneNumber = /^[\+\d\s\-\(\)]+$/.test(participant);
    
    return {
      name: participant,
      isPhoneNumber,
      displayName: isPhoneNumber ? `Número ${participant}` : participant
    };
  });
}

/**
 * Gera uma conversa mock para desenvolvimento
 * Remove esta função quando implementar parsing real
 */
function generateMockParsedConversation(): ParsedConversation {
  const person1 = 'Ana';
  const person2 = 'Bruno';
  
  const startDate = new Date('2024-01-15');
  const endDate = new Date('2024-12-03');
  
  const mockMessages: Message[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-15T18:30:00'),
      sender: person1,
      content: 'Oi! Tudo bem?',
      type: 'text',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T18:35:00'),
      sender: person2,
      content: 'Oiii! Tudo sim e você?',
      type: 'text',
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T18:36:00'),
      sender: person1,
      content: 'Também! Que bom te ver por aqui 😊',
      type: 'text',
    },
    {
      id: '4',
      timestamp: new Date('2024-01-20T20:15:00'),
      sender: person2,
      content: 'Você viu o filme que eu te indiquei?',
      type: 'text',
    },
    {
      id: '5',
      timestamp: new Date('2024-01-20T23:45:00'),
      sender: person1,
      content: 'ACABEI DE VER! QUE FILME INCRÍVEL!!!',
      type: 'text',
    },
    {
      id: '6',
      timestamp: new Date('2024-02-14T00:01:00'),
      sender: person2,
      content: 'Feliz Dia dos Namorados ❤️',
      type: 'text',
    },
    {
      id: '7',
      timestamp: new Date('2024-02-14T00:02:00'),
      sender: person1,
      content: 'Aaah que fofo! Feliz dia dos namorados pra você também 💕',
      type: 'text',
    },
    {
      id: '8',
      timestamp: new Date('2024-03-10T14:20:00'),
      sender: person1,
      content: 'Preciso te contar uma coisa...',
      type: 'text',
    },
    {
      id: '9',
      timestamp: new Date('2024-03-10T14:20:30'),
      sender: person2,
      content: 'O que foi? Tô preocupado',
      type: 'text',
    },
    {
      id: '10',
      timestamp: new Date('2024-03-10T14:25:00'),
      sender: person1,
      content: 'Eu te amo ❤️',
      type: 'text',
    },
    {
      id: '11',
      timestamp: new Date('2024-03-10T14:25:10'),
      sender: person2,
      content: 'Eu também te amo! Muito! ❤️❤️❤️',
      type: 'text',
    },
    // Adicionar mais mensagens mock aqui conforme necessário
  ];
  
  return {
    messages: mockMessages,
    participants: [person1, person2],
    startDate,
    endDate,
    totalMessages: mockMessages.length,
  };
}

/**
 * Detecta o formato do export do WhatsApp
 */
export function detectWhatsAppFormat(fileContent: string): 'ios' | 'android' | 'unknown' {
  // iOS: [DD/MM/YYYY HH:MM:SS] Nome: Mensagem
  // Android: DD/MM/YYYY, HH:MM - Nome: Mensagem
  
  const iosFormat = /\[\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}\]/;
  const androidFormat = /\d{2}\/\d{2}\/\d{4},\s\d{2}:\d{2}\s-\s/;
  
  if (iosFormat.test(fileContent)) return 'ios';
  if (androidFormat.test(fileContent)) return 'android';
  return 'unknown';
}

/**
 * Valida se o arquivo parece ser uma conversa do WhatsApp
 */
export function isValidWhatsAppConversation(fileContent: string): boolean {
  const format = detectWhatsAppFormat(fileContent);
  return format !== 'unknown';
}

/**
 * Estatísticas básicas do arquivo antes do parsing completo
 */
export function getQuickStats(fileContent: string): {
  estimatedMessages: number;
  format: string;
  fileSize: number;
} {
  const lines = fileContent.split('\n');
  const format = detectWhatsAppFormat(fileContent);
  
  return {
    estimatedMessages: lines.length,
    format,
    fileSize: fileContent.length,
  };
}

/**
 * Valida tamanho da conversa IMEDIATAMENTE após parsing
 * Previne custos desnecessários com conversas muito grandes ou pequenas
 */
export function validateConversationSize(conversation: ParsedConversation): ConversationValidation {
  const { totalMessages } = conversation;
  const warnings: string[] = [];
  
  // Limites
  const MIN_MESSAGES = 50;
  const FREE_TIER_MAX = 5000;
  const WARNING_THRESHOLD = 4500; // 90% do limite free
  
  // Validar mínimo
  if (totalMessages < MIN_MESSAGES) {
    return {
      tier: 'free',
      messageCount: totalMessages,
      estimatedCost: 0,
      isValid: false,
      warnings: [
        `Conversa muito curta para análise confiável. Mínimo: ${MIN_MESSAGES} mensagens, encontradas: ${totalMessages}.`,
      ],
    };
  }
  
  // Validar máximo free tier
  if (totalMessages > FREE_TIER_MAX) {
    return {
      tier: 'premium',
      messageCount: totalMessages,
      estimatedCost: 0.10, // $0.10 for premium
      isValid: false,
      warnings: [
        `Conversa excede limite gratuito (${FREE_TIER_MAX} mensagens). Faça upgrade para Premium ou reduza o período exportado.`,
      ],
    };
  }
  
  // Warning se próximo do limite
  if (totalMessages >= WARNING_THRESHOLD) {
    const percentUsed = Math.round((totalMessages / FREE_TIER_MAX) * 100);
    warnings.push(
      `⚠️ Você está usando ${percentUsed}% do limite gratuito (${totalMessages}/${FREE_TIER_MAX} mensagens).`
    );
  }
  
  // Estimar custo GPT (apenas para ciúme e orgulho)
  // Assumindo ~60% reduction após filtro = ~2000 msgs -> ~500 tokens -> $0.05
  const estimatedCost = totalMessages > 3000 ? 0.05 : 0.02;
  
  return {
    tier: 'free',
    messageCount: totalMessages,
    estimatedCost,
    isValid: true,
    warnings,
  };
}

/**
 * Remove mensagens irrelevantes antes de enviar para GPT
 * Reduz custos em ~60% mantendo contexto importante
 */
export function filterIrrelevantMessages(messages: Message[]): FilteredMessages {
  const originalCount = messages.length;
  
  // Lista de respostas genéricas/irrelevantes em PT-BR
  const genericResponses = [
    'ok', 'tá', 'oi', 'oie', 'oii', 'hmm', 'hm', 'uhu', 'ata', 'blz', 
    'vlw', 'kk', 'kkk', 'kkkk', 'rs', 'rsrs', 'haha', 'hehe', 'eh', 
    'sim', 'não', 'nao', 'ss', 'nn', 'ah', 'oh', 'oi?', 'e?', 'q',
  ];
  
  // Keywords emocionais importantes (MANTER sempre)
  const emotionalKeywords = [
    'amor', 'amo', 'ciúme', 'ciume', 'desculpa', 'perdão', 'perdao',
    'briga', 'brigamos', 'saudade', 'preocupado', 'preocupada',
    'chateado', 'chateada', 'triste', 'feliz', 'orgulho', 'raiva',
    'nervoso', 'nervosa', 'cansado', 'cansada', 'where', 'onde',
    'com quem', 'sozinho', 'sozinha', 'volta', 'demora', 'responde',
  ];
  
  // Substantivos importantes (contexto relevante)
  const importantNouns = [
    'trabalho', 'casa', 'família', 'familia', 'amigo', 'amiga',
    'namorado', 'namorada', 'pai', 'mãe', 'mae', 'irmão', 'irmao',
    'viagem', 'festa', 'jantar', 'almoço', 'almoco', 'encontro',
  ];
  
  const filtered = messages.filter((msg) => {
    const content = msg.content.toLowerCase().trim();
    
    // Remover mensagens vazias ou só espaços
    if (!content || content.length === 0) return false;
    
    // Remover mensagens muito curtas (< 3 chars) que são só emojis
    // Simplified emoji detection (emojis are typically in ranges > \uD800)
    if (content.length < 3 && /^[\uD83C-\uDBFF\uDC00-\uDFFF\s]+/.test(content)) return false;
    
    // MANTER: Mensagens com keywords emocionais
    if (emotionalKeywords.some(keyword => content.includes(keyword))) return true;
    
    // MANTER: Mensagens com substantivos importantes
    if (importantNouns.some(noun => content.includes(noun))) return true;
    
    // MANTER: Perguntas (indicam engajamento)
    if (content.includes('?')) return true;
    
    // MANTER: Mensagens com 10+ palavras (contexto rico)
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 10) return true;
    
    // REMOVER: Respostas genéricas monossilábicas
    if (genericResponses.includes(content)) return false;
    
    // MANTER: Todo o resto (default)
    return true;
  });
  
  const removed = originalCount - filtered.length;
  const retentionRate = originalCount > 0 ? (filtered.length / originalCount) * 100 : 0;
  
  return {
    filtered,
    removed,
    retentionRate: Math.round(retentionRate),
    originalCount,
  };
}
