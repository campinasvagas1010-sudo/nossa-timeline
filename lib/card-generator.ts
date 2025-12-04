/**
 * Gerador de cards PNG para batalhas
 * Formato: 1080x1920 (Instagram Stories)
 */

import { createCanvas, loadImage, registerFont, Canvas } from 'canvas';
import path from 'path';

export interface BattleCardData {
  category: string;
  categoryName: string;
  winner: string;
  loser: string;
  winnerPercentage: number;
  result: string;
  backgroundGradient: [string, string];
}

// Gradientes para cada categoria (igual aos cards atuais)
const CATEGORY_GRADIENTS: { [key: string]: [string, string] } = {
  ciume: ['#FF6B9D', '#C44569'],
  carinhoso: ['#FFB6C1', '#FF69B4'],
  demora: ['#4A90E2', '#357ABD'],
  vacuo: ['#9B59B6', '#8E44AD'],
  orgulhoso: ['#E67E22', '#D35400'],
  dr: ['#E74C3C', '#C0392B'],
  reconciliacao: ['#27AE60', '#229954'],
  romantico: ['#F39C12', '#E67E22'],
  engracado: ['#F1C40F', '#F39C12'],
  preocupado: ['#3498DB', '#2980B9'],
  saudade: ['#9B59B6', '#8E44AD'],
  grudento: ['#FF6B9D', '#E056FD'],
  planejador: ['#00B894', '#00A383'],
  complimento: ['#FDCB6E', '#F39C12'],
  emoji: ['#FD79A8', '#F093FB'],
};

/**
 * Cria canvas base com gradiente de fundo
 */
function createBaseCanvas(gradient: [string, string]): Canvas {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext('2d');
  
  // Gradiente de fundo
  const grd = ctx.createLinearGradient(0, 0, 0, 1920);
  grd.addColorStop(0, gradient[0]);
  grd.addColorStop(1, gradient[1]);
  
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1080, 1920);
  
  return canvas;
}

/**
 * Desenha texto centralizado com sombra
 */
function drawCenteredText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontWeight: string = 'bold',
  color: string = '#FFFFFF',
  maxWidth?: number
) {
  ctx.font = `${fontWeight} ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Sombra para legibilidade
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  
  if (maxWidth) {
    ctx.fillText(text, x, y, maxWidth);
  } else {
    ctx.fillText(text, x, y);
  }
  
  // Resetar sombra
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Quebra texto em múltiplas linhas
 */
function wrapText(
  ctx: any,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  ctx.font = `400 ${fontSize}px Arial, sans-serif`;
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine.trim() !== '') {
    lines.push(currentLine.trim());
  }
  
  return lines;
}

/**
 * Gera card de batalha
 */
export async function generateBattleCard(data: BattleCardData): Promise<Buffer> {
  console.log(`[Card Generator] Gerando card: ${data.categoryName}`);
  
  const gradient = CATEGORY_GRADIENTS[data.category] || ['#667EEA', '#764BA2'];
  const canvas = createBaseCanvas(gradient);
  const ctx = canvas.getContext('2d');
  
  const centerX = 1080 / 2;
  
  // 1. Logo/Título do app (topo)
  drawCenteredText(ctx, 'NOSSA TIMELINE', centerX, 150, 48, 'bold', '#FFFFFF');
  
  // 2. Nome da categoria
  drawCenteredText(ctx, data.categoryName.toUpperCase(), centerX, 350, 64, 'bold', '#FFFFFF');
  
  // 3. Emoji indicador (exemplo: 🏆)
  drawCenteredText(ctx, '🏆', centerX, 500, 120, 'normal', '#FFFFFF');
  
  // 4. Nome do vencedor
  drawCenteredText(ctx, data.winner, centerX, 680, 72, 'bold', '#FFFFFF');
  
  // 5. Percentual de vitória
  drawCenteredText(
    ctx,
    `${data.winnerPercentage}%`,
    centerX,
    820,
    96,
    'bold',
    '#FFFFFF'
  );
  
  // 6. Box branco semi-transparente para o resultado
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.roundRect(90, 950, 900, 300, 30);
  ctx.fill();
  
  // 7. Texto do resultado (quebrado em múltiplas linhas)
  const resultLines = wrapText(ctx, data.result, 850, 32);
  const lineHeight = 45;
  const startY = 1100 - (resultLines.length * lineHeight) / 2;
  
  resultLines.forEach((line, index) => {
    drawCenteredText(
      ctx,
      line,
      centerX,
      startY + index * lineHeight,
      32,
      '400',
      '#FFFFFF'
    );
  });
  
  // 8. vs (com o perdedor)
  drawCenteredText(
    ctx,
    `vs ${data.loser}`,
    centerX,
    1350,
    40,
    '400',
    'rgba(255, 255, 255, 0.8)'
  );
  
  // 9. Call to action no rodapé
  drawCenteredText(
    ctx,
    'Crie a sua timeline',
    centerX,
    1700,
    36,
    '600',
    '#FFFFFF'
  );
  
  drawCenteredText(
    ctx,
    'nossatimeline.com',
    centerX,
    1780,
    42,
    'bold',
    '#FFFFFF'
  );
  
  console.log(`[Card Generator] ✅ Card gerado: ${data.categoryName}`);
  
  return canvas.toBuffer('image/png');
}

/**
 * Gera múltiplos cards de uma vez
 */
export async function generateAllBattleCards(
  battles: any[],
  participants: [string, string]
): Promise<{ category: string; buffer: Buffer }[]> {
  console.log(`[Card Generator] Gerando ${battles.length} cards...`);
  
  const cards: { category: string; buffer: Buffer }[] = [];
  
  for (const battle of battles) {
    if (battle.error) {
      console.log(`[Card Generator] ⏭️  Pulando ${battle.name} (erro na análise)`);
      continue;
    }
    
    const loser = participants.find(p => p !== battle.winner) || 'Outro';
    
    const cardData: BattleCardData = {
      category: battle.category,
      categoryName: battle.name,
      winner: battle.winner,
      loser,
      winnerPercentage: battle.confidence,
      result: battle.result,
      backgroundGradient: CATEGORY_GRADIENTS[battle.category] || ['#667EEA', '#764BA2'],
    };
    
    try {
      const buffer = await generateBattleCard(cardData);
      cards.push({
        category: battle.category,
        buffer,
      });
    } catch (error) {
      console.error(`[Card Generator] ❌ Erro ao gerar ${battle.name}:`, error);
    }
  }
  
  console.log(`[Card Generator] ✅ ${cards.length} cards gerados com sucesso`);
  
  return cards;
}
