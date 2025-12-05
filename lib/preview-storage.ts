/**
 * Armazena previews temporárias em memória (expiram em 10 minutos)
 */

interface PreviewData {
  id: string;
  relationType: string;
  person1Name: string;
  person2Name: string;
  totalMessages: number;
  conversationText: string;
  cards: any[];
  moments: any[];
  createdAt: string;
  expiresAt: string;
}

export const storiesInMemory = new Map<string, PreviewData>();

// Limpar previews expiradas a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(storiesInMemory.entries());
  for (const [id, preview] of entries) {
    if (new Date(preview.expiresAt).getTime() < now) {
      storiesInMemory.delete(id);
      console.log('[Memory] Preview expirada removida:', id);
    }
  }
}, 5 * 60 * 1000);
