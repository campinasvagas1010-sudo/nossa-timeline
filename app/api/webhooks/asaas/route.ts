import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPaymentStatus } from '@/lib/asaas-service';

/**
 * Webhook do Asaas
 * POST /api/webhooks/asaas
 * 
 * Eventos:
 * - PAYMENT_CREATED: Cobrança criada
 * - PAYMENT_CONFIRMED: Pagamento confirmado (PIX)
 * - PAYMENT_RECEIVED: Pagamento recebido (confirmação final)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Webhook Asaas] Evento recebido:', body.event);
    
    const { event, payment } = body;
    
    if (!payment || !payment.id) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }
    
    // Buscar pagamento no banco
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('asaas_payment_id', payment.id)
      .single();
    
    if (paymentError || !paymentRecord) {
      console.error('[Webhook] Pagamento não encontrado:', payment.id);
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
    }
    
    const slug = paymentRecord.slug;
    
    // Processar evento
    switch (event) {
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED':
        console.log(`[Webhook] ✅ Pagamento confirmado: ${payment.id} (${slug})`);
        
        // Atualizar status do pagamento
        await supabase
          .from('payments')
          .update({
            status: 'confirmed',
            paid_at: new Date().toISOString(),
          })
          .eq('asaas_payment_id', payment.id);
        
        // Fazer upgrade para premium
        const { error: upgradeError } = await supabase
          .from('stories')
          .update({
            is_premium: true,
            payment_pending: false,
          })
          .eq('slug', slug);
        
        if (upgradeError) {
          console.error(`[Webhook] ❌ Erro ao fazer upgrade: ${slug}`, upgradeError);
        } else {
          console.log(`[Webhook] ✅ História ${slug} atualizada para premium`);
          
          // Disparar geração da timeline completa (assíncrono)
          fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate/full-timeline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          }).catch(err => console.error('[Webhook] Erro ao gerar timeline:', err));
        }
        
        break;
      
      case 'PAYMENT_OVERDUE':
        console.log(`[Webhook] ⏰ Pagamento vencido: ${payment.id}`);
        
        await supabase
          .from('payments')
          .update({ status: 'overdue' })
          .eq('asaas_payment_id', payment.id);
        
        break;
      
      case 'PAYMENT_DELETED':
      case 'PAYMENT_REFUNDED':
        console.log(`[Webhook] 🔄 Pagamento cancelado/reembolsado: ${payment.id}`);
        
        await supabase
          .from('payments')
          .update({ status: 'refunded' })
          .eq('asaas_payment_id', payment.id);
        
        // Remover premium se necessário
        await supabase
          .from('stories')
          .update({ is_premium: false })
          .eq('slug', slug);
        
        break;
      
      default:
        console.log(`[Webhook] Evento ignorado: ${event}`);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('[Webhook] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

/**
 * Verificar status de pagamento manualmente
 * GET /api/webhooks/asaas?paymentId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    
    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId obrigatório' }, { status: 400 });
    }
    
    console.log(`[Webhook] Verificando status: ${paymentId}`);
    
    const payment = await getPaymentStatus(paymentId);
    
    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      value: payment.value,
      dueDate: payment.dueDate,
    });
    
  } catch (error: any) {
    console.error('[Webhook] Erro ao verificar status:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar status' },
      { status: 500 }
    );
  }
}
