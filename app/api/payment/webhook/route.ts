import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/mercadopago-service';
import { supabaseAdmin } from '@/lib/supabase';
import { generateFullTimeline } from '@/lib/full-timeline-generator';

/**
 * Webhook do MercadoPago
 * POST /api/payment/webhook
 * 
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[MercadoPago Webhook] Notificação recebida:', body);

    // MercadoPago envia: { action: "payment.updated", data: { id: "123" } }
    if (body.action !== 'payment.updated' && body.action !== 'payment.created') {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID não encontrado' }, { status: 400 });
    }

    // Consultar status do pagamento no MercadoPago
    const paymentStatus = await getPaymentStatus(paymentId.toString());

    if (paymentStatus.status !== 'approved') {
      console.log('[MercadoPago Webhook] Pagamento ainda não aprovado:', paymentStatus.status);
      return NextResponse.json({ received: true });
    }

    console.log('[MercadoPago Webhook] ✅ Pagamento aprovado!');

    // Buscar história pelo payment_id
    const { data: story, error: storyError } = await supabaseAdmin
      .from('stories')
      .select('*')
      .eq('payment_id', paymentId.toString())
      .single();

    if (storyError || !story) {
      console.error('[MercadoPago Webhook] História não encontrada:', paymentId);
      return NextResponse.json({ error: 'História não encontrada' }, { status: 404 });
    }

    // Verificar se já foi processado
    if (story.is_premium) {
      console.log('[MercadoPago Webhook] História já é premium:', story.slug);
      return NextResponse.json({ received: true, message: 'Já processado' });
    }

    console.log('[MercadoPago Webhook] Gerando timeline completa...');

    // Gerar timeline completa com IA
    const fullTimeline = await generateFullTimeline(story.conversation_text || '');

    // Calcular data de expiração (48h)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    // Atualizar história para premium
    const { error: updateError } = await supabaseAdmin
      .from('stories')
      .update({
        is_premium: true,
        payment_status: 'approved',
        timeline: fullTimeline,
        expires_at: expiresAt,
      })
      .eq('id', story.id);

    if (updateError) {
      console.error('[MercadoPago Webhook] Erro ao atualizar:', updateError);
      return NextResponse.json({ error: 'Erro ao atualizar história' }, { status: 500 });
    }

    console.log('[MercadoPago Webhook] ✅ Premium ativado com sucesso!');

    return NextResponse.json({ 
      success: true,
      slug: story.slug,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/h/${story.slug}`,
      expiresAt
    });

  } catch (error) {
    console.error('[MercadoPago Webhook] Erro:', error);
    return NextResponse.json(
      { error: 'Erro no webhook' },
      { status: 500 }
    );
  }
}

/**
 * GET apenas para teste (MercadoPago sempre usa POST)
 */
export async function GET() {
  return NextResponse.json({
    service: 'MercadoPago Webhook Handler',
    status: 'active',
    events: ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED']
  });
}
