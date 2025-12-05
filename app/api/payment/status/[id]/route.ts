import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/mercadopago-service';

/**
 * API: Consultar status de pagamento
 * GET /api/payment/status/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;

    console.log('[Payment Status] Consultando pagamento:', paymentId);

    const result = await getPaymentStatus(paymentId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      isPaid: result.status === 'approved',
    });

  } catch (error: any) {
    console.error('[Payment Status] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar status' },
      { status: 500 }
    );
  }
}
