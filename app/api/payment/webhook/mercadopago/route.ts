import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getPaymentStatus } from '@/lib/mercadopago-service';

export const dynamic = 'force-dynamic';

/**
 * Webhook do MercadoPago
 * POST /api/payment/webhook/mercadopago
 * 
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[MercadoPago Webhook] Notificação recebida:', body);

    // MercadoPago envia: { action: "payment.updated", data: { id: "123456" } }
    if (body.action === 'payment.updated' || body.action === 'payment.created') {
      const paymentId = body.data?.id;

      if (!paymentId) {
        console.log('[MercadoPago Webhook] ID do pagamento não encontrado');
        return NextResponse.json({ error: 'Payment ID missing' }, { status: 400 });
      }

      console.log('[MercadoPago Webhook] Consultando status do pagamento:', paymentId);

      // Consultar status no MercadoPago
      const mpStatus = await getPaymentStatus(paymentId);

      if (!mpStatus.success) {
        console.error('[MercadoPago Webhook] Erro ao consultar pagamento');
        return NextResponse.json({ error: 'Failed to get payment status' }, { status: 500 });
      }

      console.log('[MercadoPago Webhook] Status recebido:', mpStatus.status);

      // Atualizar status no banco
      const { error: updateError } = await supabaseAdmin
        .from('payments')
        .update({ status: mpStatus.status || 'pending' })
        .eq('payment_id', paymentId.toString());

      if (updateError) {
        console.error('[MercadoPago Webhook] Erro ao atualizar banco:', updateError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log('[MercadoPago Webhook] ✅ Status atualizado no banco:', paymentId, '→', mpStatus.status);

      return NextResponse.json({ success: true });
    }

    // Outras notificações (ignorar)
    console.log('[MercadoPago Webhook] Notificação ignorada:', body.action);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[MercadoPago Webhook] Erro:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Endpoint de teste (GET)
export async function GET() {
  return NextResponse.json({
    message: 'MercadoPago Webhook está ativo',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook/mercadopago`,
  });
}
