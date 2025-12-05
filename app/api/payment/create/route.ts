import { NextRequest, NextResponse } from 'next/server';
import { createPixPayment } from '@/lib/mercadopago-service';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * API: Criar pagamento PIX no MercadoPago
 * POST /api/payment/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, cpf } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email e nome são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('[Payment API] Criando pagamento para:', { email, name });

    // Criar pagamento MercadoPago DIRETO
    const mpPayment = await createPixPayment({
      email,
      name,
      cpf,
      amount: 9.90,
      description: 'Nossa Timeline - Acesso Premium 48h',
      externalReference: `payment-${Date.now()}`,
    });

    console.log('[Payment API] ✅ Pagamento criado:', mpPayment.paymentId);

    // Salvar pagamento no banco para validação posterior
    const { error: dbError } = await supabaseAdmin
      .from('payments')
      .insert({
        email: email.toLowerCase().trim(),
        payment_id: mpPayment.paymentId,
        status: 'pending',
      });

    if (dbError) {
      console.error('[Payment API] Erro ao salvar no banco:', dbError);
      // Não retorna erro pro cliente, pagamento já foi criado no MercadoPago
    }

    return NextResponse.json({
      success: true,
      paymentId: mpPayment.paymentId,
      pixQrCode: mpPayment.qrCode,
      pixCopyPaste: mpPayment.qrCodeText,
      amount: 9.90,
      email: email.toLowerCase().trim(),
    });

  } catch (error) {
    console.error('[Payment API] Erro:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar pagamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
