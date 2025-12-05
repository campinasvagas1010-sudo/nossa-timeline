import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getPaymentStatus } from '@/lib/mercadopago-service';

export const dynamic = 'force-dynamic';

/**
 * API: Verificar se email tem pagamento aprovado
 * GET /api/payment/verify?email=teste@email.com
 */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('[Payment Verify] Verificando pagamento para:', normalizedEmail);

    // Buscar pagamento mais recente deste email
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('email', normalizedEmail)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[Payment Verify] Erro ao consultar banco:', error);
      return NextResponse.json(
        { error: 'Erro ao verificar pagamento' },
        { status: 500 }
      );
    }

    // Se não encontrou pagamento no banco
    if (!payments || payments.length === 0) {
      console.log('[Payment Verify] Nenhum pagamento encontrado');
      return NextResponse.json({
        success: false,
        status: 'not_found',
        message: 'Nenhum pagamento encontrado para este email',
      });
    }

    const payment = payments[0];
    console.log('[Payment Verify] Pagamento encontrado:', payment.payment_id, 'Status:', payment.status);

    // Se já está aprovado no banco, retorna sucesso
    if (payment.status === 'approved') {
      return NextResponse.json({
        success: true,
        status: 'approved',
        message: 'Pagamento aprovado!',
      });
    }

    // Se está pending, consulta MercadoPago para atualizar
    if (payment.status === 'pending') {
      console.log('[Payment Verify] Consultando status no MercadoPago...');
      const mpStatus = await getPaymentStatus(payment.payment_id);

      if (mpStatus.success && mpStatus.status === 'approved') {
        // Atualizar status no banco
        await supabaseAdmin
          .from('payments')
          .update({ status: 'approved' })
          .eq('id', payment.id);

        console.log('[Payment Verify] ✅ Pagamento aprovado e atualizado no banco');

        return NextResponse.json({
          success: true,
          status: 'approved',
          message: 'Pagamento aprovado!',
        });
      }

      // Ainda está pendente
      return NextResponse.json({
        success: false,
        status: 'pending',
        message: 'Pagamento em processamento. Aguarde alguns instantes e tente novamente.',
      });
    }

    // Outros status (rejected, cancelled)
    return NextResponse.json({
      success: false,
      status: payment.status,
      message: 'Pagamento não foi aprovado',
    });

  } catch (error) {
    console.error('[Payment Verify] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    );
  }
}
