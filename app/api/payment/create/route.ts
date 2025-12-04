import { NextRequest, NextResponse } from 'next/server';
import { supabase, generateSlug } from '@/lib/supabase';
import { createOrGetCustomer, createPixPayment } from '@/lib/asaas-service';

/**
 * Cria cobrança para upgrade Premium
 * POST /api/payment/create
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Payment Create] Recebido:', body);
    
    const { previewId, slug, customerName, customerEmail, customerPhone } = body;
    
    // Validar campos obrigatórios
    if (!customerName) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }
    
    // Email genérico se não fornecido
    const email = customerEmail || `${Date.now()}@nossotimeline.com`;
    
    if (!previewId && !slug) {
      return NextResponse.json(
        { error: 'PreviewId ou slug são necessários' },
        { status: 400 }
      );
    }
    
    let storySlug = slug;
    let story: any = null;
    
    // Se veio previewId, buscar na memória e salvar no banco
    if (previewId) {
      const globalForStories = global as typeof global & {
        storiesInMemory?: Map<string, any>;
      };
      
      const previewData = globalForStories.storiesInMemory?.get(previewId);
      
      console.log('[Payment Create] Preview na memória?', !!previewData);
      console.log('[Payment Create] Total previews:', globalForStories.storiesInMemory?.size || 0);

      if (!previewData) {
        return NextResponse.json(
          { error: 'Preview não encontrado. Gere a análise novamente.' },
          { status: 404 }
        );
      }

      // Gerar slug e salvar story
      storySlug = generateSlug();
      
      console.log('[Payment Create] Salvando story no banco:', { previewId, storySlug });
      
      const { supabaseAdmin } = await import('@/lib/supabase');
      const { data: newStory, error: storyError } = await supabaseAdmin
        .from('stories')
        .insert({
          slug: storySlug,
          preview_id: previewId,
          person1_name: previewData.person1Name || 'Pessoa 1',
          person2_name: previewData.person2Name || 'Pessoa 2',
          relationship_type: previewData.relationType || 'casal',
          total_messages: previewData.totalMessages || 0,
          cards: previewData.cards || [],
          moments: previewData.moments || [],
          conversation_text: previewData.conversationText,
          is_premium: false,
          payment_pending: true,
        })
        .select()
        .single();

      if (storyError) {
        console.error('[Payment] Erro ao salvar story:', storyError);
        return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
      }
      story = newStory;
    } else {
      // Se veio slug, buscar story existente
      const { supabaseAdmin } = await import('@/lib/supabase');
      const { data: existingStory, error: storyError } = await supabaseAdmin
        .from('stories')
        .select('*')
        .eq('slug', storySlug)
        .single();

      if (storyError || !existingStory) {
        return NextResponse.json({ error: 'História não encontrada' }, { status: 404 });
      }

      if (existingStory.is_premium) {
        return NextResponse.json({ error: 'Esta história já é premium' }, { status: 400 });
      }
      story = existingStory;
    }

    // Criar cliente no Asaas
    const asaasCustomer = await createOrGetCustomer({
      name: customerName,
      email: email,
      phone: customerPhone,
    });

    // Criar pagamento PIX
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + 1);
    const asaasPayment = await createPixPayment({
      customer: asaasCustomer.id,
      billingType: 'PIX',
      value: 9.90,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `Nosso Timeline Premium - ${storySlug}`,
      externalReference: storySlug,
    });

    // Salvar payment no banco
    const { supabaseAdmin: supabaseAdminPayment } = await import('@/lib/supabase');
    await supabaseAdminPayment.from('payments').insert({
      story_id: story.id,
      slug: storySlug,
      asaas_payment_id: asaasPayment.id,
      asaas_invoice_url: asaasPayment.invoiceUrl,
      pix_qr_code: asaasPayment.pixQrCodeUrl,
      pix_copy_paste: asaasPayment.pixCopyAndPaste,
      status: 'pending',
      amount: 9.90,
      customer_name: customerName,
      customer_email: email,
      customer_phone: customerPhone,
    });

    console.log(`[Payment] ✅ Pagamento criado: ${asaasPayment.id}`);

    return NextResponse.json({
      success: true,
      slug: storySlug,
      paymentId: asaasPayment.id,
      invoiceUrl: asaasPayment.invoiceUrl,
      pixQrCode: asaasPayment.pixQrCodeUrl,
      pixCopyPaste: asaasPayment.pixCopyAndPaste,
      amount: 9.90,
    });
    
  } catch (error: any) {
    console.error('[Payment] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar pagamento' },
      { status: 500 }
    );
  }
}
