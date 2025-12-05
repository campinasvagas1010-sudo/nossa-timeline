// ==========================================
// TIPOS BASE DA CONVERSA
// ==========================================

export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: 'text' | 'media' | 'deleted' | 'audio';
  isEdited?: boolean;
}

export interface ConversationMetadata {
  startDate: Date;
  endDate: Date;
  totalMessages: number;
  totalDays?: number;
  participants: string[];
  relationType: RelationType;
}

// ==========================================
// TIPOS DE RELACIONAMENTO
// ==========================================

export type RelationType = 'casal' | 'amizade' | 'familia' | 'outro';

export interface ParticipantInfo {
  name: string;
  photoUrl?: string;
}

// ==========================================
// ESTRUTURA DA HISTÓRIA COMPLETA
// ==========================================

export interface Story {
  id: string;
  slug: string;
  metadata: ConversationMetadata;
  participants: {
    person1: ParticipantInfo;
    person2: ParticipantInfo;
  };
  compatibilityScore: number; // 0-100
  timeline: TimelineChapter[];
  stats: Statistics;
  modes: {
    romance: RomanceMode;
    disputa: DisputaMode;
    exposed: ExposedMode;
  };
  shareableCards: ShareableCard[];
  createdAt: Date;
  isPremium: boolean; // false = preview, true = completo
}

// ==========================================
// TIMELINE E CAPÍTULOS
// ==========================================

export interface TimelineChapter {
  id: string;
  title: string;
  subtitle?: string;
  date: Date;
  description: string;
  messages: Message[];
  emoji: string;
  category: 'inicio' | 'milestone' | 'conflito' | 'reconciliacao' | 'memoria' | 'especial';
}

// ==========================================
// ESTATÍSTICAS VIRAIS
// ==========================================

export interface Statistics {
  general: GeneralStats;
  comparison: ComparisonStats;
  fun: FunStats;
  emotional: EmotionalStats;
}

export interface GeneralStats {
  totalDays: number;
  totalMessages: number;
  totalWords: number;
  averageMessagesPerDay: number;
  longestConversation: {
    date: Date;
    messageCount: number;
  };
  quietestPeriod: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
}

export interface ComparisonStats {
  person1: PersonStats;
  person2: PersonStats;
  winner: {
    mostMessages: string;
    mostEmojis: string;
    mostAudios: string;
    fastestResponder: string;
    nightOwl: string;
    morningPerson: string;
  };
}

export interface PersonStats {
  name: string;
  totalMessages: number;
  averageMessageLength: number;
  totalEmojis: number;
  totalAudios: number;
  totalPhotos: number;
  averageResponseTime: string; // "2 min", "5h", etc
  mostUsedEmoji: string;
  mostUsedWord: string;
  longestMessage: {
    content: string;
    wordCount: number;
  };
  messagesByHour: Record<string, number>; // "00": 5, "01": 2, etc
}

export interface FunStats {
  totalEmojis: number;
  totalLaughs: number; // "kkk", "haha", "rsrs"
  totalHearts: number; // "❤️", "💕", etc
  mostUsedPhrase: string;
  coincidences: string[]; // ["Vocês disseram 'eu te amo' ao mesmo tempo 12 vezes"]
  funFacts: string[]; // ["Vocês trocaram 247 mensagens em um único dia"]
}

export interface EmotionalStats {
  sweetestMoment: {
    date: Date;
    message: string;
    sender: string;
  };
  funniestMoment: {
    date: Date;
    message: string;
    sender: string;
  };
  mostEmotionalDay: {
    date: Date;
    reason: string;
  };
  firstILoveYou?: {
    date: Date;
    sender: string;
  };
}

// ==========================================
// MODOS DE VISUALIZAÇÃO
// ==========================================

export interface RomanceMode {
  title: string;
  summary: string; // Texto emocional sobre a história
  highlights: RomanceHighlight[];
  loveScore: number; // 0-100
}

export interface RomanceHighlight {
  title: string;
  description: string;
  emoji: string;
  date?: Date;
}

export interface DisputaMode {
  title: string;
  battles: Battle[];
  overallWinner: string;
}

export interface Battle {
  category: string;
  person1Score: number | string;
  person2Score: number | string;
  winner: string;
  emoji: string;
  metric?: string; // Descrição da métrica usada
  funnyComment?: string; // Comentário engraçado sobre a batalha
  confidence?: number; // 0-100 (confiabilidade da análise)
  analysisTimeframe?: {
    months: number;
    description: string;
  };
  detectedPatterns?: string[]; // Padrões específicos detectados
  evidence?: string[]; // Provas específicas da batalha
  cardImage?: string; // Caminho para o card PNG (e.g., '/cards/ciume.png')
}

export interface ExposedMode {
  title: string;
  secrets: Secret[];
  awkwardMoments: AwkwardMoment[];
  patterns: Pattern[];
}

export interface Secret {
  title: string;
  description: string;
  emoji: string;
  revealedData: string;
}

export interface AwkwardMoment {
  date: Date;
  description: string;
  cringeLevel: number; // 1-5
}

export interface Pattern {
  title: string;
  description: string;
  frequency: string;
  emoji: string;
}

// ==========================================
// CARDS COMPARTILHÁVEIS (para Stories)
// ==========================================

export interface ShareableCard {
  id: string;
  type: CardType;
  title: string;
  content: CardContent;
  style: CardStyle;
}

export type CardType = 
  | 'compatibility-score'
  | 'battle-result'
  | 'battle-card'
  | 'moment-highlight'
  | 'red-green-flags'
  | 'confession'
  | 'fun-fact'
  | 'timeline-preview'
  | 'qr-share';

export interface CardContent {
  headline: string;
  body: string | string[];
  footer?: string;
  data?: Record<string, any>; // Dados específicos do card
}

export interface CardStyle {
  gradient: 'romantic' | 'fun' | 'dark' | 'neutral';
  primaryColor: string;
  secondaryColor: string;
  emoji?: string;
}

// ==========================================
// FORMULÁRIO DE CRIAÇÃO
// ==========================================

export interface CreateStoryFormData {
  file: File;
  relationType: RelationType;
  person1Name: string;
  person2Name: string;
  person1Photo?: File;
  person2Photo?: File;
}

// ==========================================
// API RESPONSES
// ==========================================

export interface GenerateStoryResponse {
  success: boolean;
  previewId?: string;
  error?: string;
}

export interface PreviewStoryData {
  id: string;
  compatibilityScore: number;
  timelinePreview: TimelineChapter[]; // Primeiros 3-4 capítulos
  statsPreview: Partial<Statistics>; // 5 estatísticas mais virais
  cardPreview: ShareableCard; // 1 card de exemplo
  metadata: ConversationMetadata;
  participants: {
    person1: ParticipantInfo;
    person2: ParticipantInfo;
  };
}
