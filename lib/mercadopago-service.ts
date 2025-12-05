/**
 * MercadoPago Payment Service
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs
 */

import { MercadoPagoConfig, Payment } from 'mercadopago';

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

if (!MERCADOPAGO_ACCESS_TOKEN) {
  console.error('[MercadoPago] ERRO: MERCADOPAGO_ACCESS_TOKEN não configurado!');
}

const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
  }
});

const payment = new Payment(client);

interface CreatePixPaymentParams {
  email: string;
  name: string;
  cpf?: string;
  amount: number;
  description: string;
  externalReference: string; // slug da história
}

interface MercadoPagoPaymentResponse {
  paymentId: string;
  qrCode: string;
  qrCodeText: string;
  status: string;
}

/**
 * Cria um pagamento PIX no MercadoPago
 */
export async function createPixPayment(params: CreatePixPaymentParams): Promise<MercadoPagoPaymentResponse> {
  try {
    console.log('[MercadoPago] Criando pagamento PIX...', {
      email: params.email,
      amount: params.amount,
      reference: params.externalReference
    });

    const paymentData = {
      transaction_amount: params.amount,
      description: params.description,
      payment_method_id: 'pix',
      payer: {
        email: params.email,
        first_name: params.name.split(' ')[0],
        last_name: params.name.split(' ').slice(1).join(' ') || params.name,
        ...(params.cpf && {
          identification: {
            type: 'CPF',
            number: params.cpf.replace(/\D/g, ''),
          }
        })
      },
      external_reference: params.externalReference,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook/mercadopago`,
    };

    const response = await payment.create({ body: paymentData });

    console.log('[MercadoPago] ✅ Pagamento criado:', response.id);

    return {
      paymentId: response.id?.toString() || '',
      qrCode: response.point_of_interaction?.transaction_data?.qr_code_base64 || '',
      qrCodeText: response.point_of_interaction?.transaction_data?.qr_code || '',
      status: response.status || 'pending',
    };

  } catch (error) {
    console.error('[MercadoPago] Erro ao criar pagamento:', error);
    throw error;
  }
}

/**
 * Consulta status de um pagamento
 */
export async function getPaymentStatus(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId });
    return {
      status: response.status,
      statusDetail: response.status_detail,
      externalReference: response.external_reference,
    };
  } catch (error) {
    console.error('[MercadoPago] Erro ao consultar pagamento:', error);
    throw error;
  }
}
