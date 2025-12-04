import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint - Verifica se a API key está sendo lida
 * GET /api/debug-env
 */
export async function GET(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    firstChars: apiKey?.substring(0, 10) || 'não encontrada',
    lastChars: apiKey?.substring(apiKey.length - 5) || '',
    hasWhitespace: apiKey ? /\s/.test(apiKey) : false,
    message: apiKey 
      ? 'Chave encontrada! Se ainda der erro, a chave pode estar inválida no Google.'
      : 'Chave NÃO encontrada! Verifique se o .env.local existe e se o servidor foi reiniciado.',
  });
}
