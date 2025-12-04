import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 });
    }

    // Buscar pagamento no banco
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('slug', slug)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        slug: payment.slug,
        status: payment.status,
        amount: payment.amount,
        pix_qr_code: payment.pix_qr_code,
        pix_copy_paste: payment.pix_copy_paste,
        asaas_invoice_url: payment.asaas_invoice_url,
        created_at: payment.created_at,
        paid_at: payment.paid_at,
      },
    });
  } catch (error) {
    console.error('[Payment Status] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pagamento' },
      { status: 500 }
    );
  }
}
