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

    // Gerar slug único
    const slug = `timeline-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Criar pagamento MercadoPago DIRETO
    const mpPayment = await createPixPayment({
      email,
      name,
      cpf,
      amount: 9.90,
      description: 'Nossa Timeline - Acesso Premium 48h',
      externalReference: slug,
    });

    // Salvar NO BANCO com dados mínimos (cliente vai enviar conversa depois de pagar)
    const { data: savedStory, error: saveError } = await supabaseAdmin
      .from('stories')
      .insert({
        slug: slug,
        person1_name: name,
        person2_name: 'Aguardando',
        relationship_type: 'casal',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        total_messages: 0,
        battles: [],
        timeline: [],
        is_premium: false,
        payment_id: mpPayment.paymentId,
        payment_status: 'pending',
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Payment API] Erro ao salvar story:', saveError);
      return NextResponse.json(
        { error: 'Erro ao salvar no banco' },
        { status: 500 }
      );
    }

    console.log('[Payment API] ✅ Pagamento criado:', mpPayment.paymentId, 'Slug:', slug);

    return NextResponse.json({
      success: true,
      paymentId: mpPayment.paymentId,
      pixQrCode: mpPayment.qrCode,
      pixCopyPaste: mpPayment.qrCodeText,
      amount: 9.90,
      slug: slug,
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
