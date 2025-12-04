/**
 * Serviço de integração com Asaas (Gateway de Pagamento)
 * Documentação: https://docs.asaas.com
 */

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_BASE_URL = process.env.ASAAS_ENV === 'production' 
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3';

console.log('[Asaas] API_KEY carregada:', ASAAS_API_KEY ? `Sim (${ASAAS_API_KEY.substring(0, 20)}...)` : 'NÃO');
console.log('[Asaas] ENV:', process.env.ASAAS_ENV);
console.log('[Asaas] URL:', ASAAS_BASE_URL);

if (!ASAAS_API_KEY) {
  console.error('[Asaas] ERRO: ASAAS_API_KEY não configurada!');
}

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

interface AsaasPayment {
  id: string;
  invoiceUrl: string;
  status: string;
  value: number;
  pixQrCodeUrl?: string;
  pixCopyAndPaste?: string;
}

interface CreateCustomerParams {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

interface CreatePaymentParams {
  customer: string; // ID do customer no Asaas
  billingType: 'PIX';
  value: number;
  dueDate: string; // YYYY-MM-DD
  description: string;
  externalReference?: string; // Nosso slug
}

/**
 * Cria ou busca um cliente no Asaas
 */
export async function createOrGetCustomer(params: CreateCustomerParams): Promise<AsaasCustomer> {
  try {
    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY não configurada');
    }

    console.log('[Asaas] Buscando cliente:', params.email);
    
    // Primeiro tenta buscar por email
    const searchResponse = await fetch(
      `${ASAAS_BASE_URL}/customers?email=${encodeURIComponent(params.email)}`,
      {
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const searchData = await searchResponse.json();

    // Se encontrou, retorna o primeiro
    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0];
    }

    // Se não encontrou, cria novo
    const createResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        cpfCnpj: params.cpfCnpj,
        mobilePhone: params.phone,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      console.error('[Asaas] Erro ao criar cliente:', error);
      throw new Error(`Erro ao criar cliente Asaas: ${JSON.stringify(error)}`);
    }

    const newCustomer = await createResponse.json();
    console.log('[Asaas] Cliente criado:', newCustomer.id);
    return newCustomer;
  } catch (error) {
    console.error('[Asaas] Erro ao criar/buscar cliente:', error);
    throw error;
  }
}

/**
 * Cria um pagamento PIX no Asaas
 */
export async function createPixPayment(params: CreatePaymentParams): Promise<AsaasPayment> {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: params.customer,
        billingType: 'PIX',
        value: params.value,
        dueDate: params.dueDate,
        description: params.description,
        externalReference: params.externalReference,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar pagamento Asaas: ${JSON.stringify(error)}`);
    }

    const payment = await response.json();

    // Buscar QR Code PIX (demora alguns segundos para gerar)
    const pixResponse = await fetch(
      `${ASAAS_BASE_URL}/payments/${payment.id}/pixQrCode`,
      {
        headers: {
          'access_token': ASAAS_API_KEY,
        },
      }
    );

    let pixData = null;
    if (pixResponse.ok) {
      pixData = await pixResponse.json();
    }

    return {
      ...payment,
      pixQrCodeUrl: pixData?.encodedImage || null,
      pixCopyAndPaste: pixData?.payload || null,
    };
  } catch (error) {
    console.error('[Asaas] Erro ao criar pagamento PIX:', error);
    throw error;
  }
}

/**
 * Consulta status de um pagamento
 */
export async function getPaymentStatus(paymentId: string): Promise<AsaasPayment> {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}`, {
      headers: {
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('[Asaas] Erro ao consultar pagamento:', error);
    throw error;
  }
}

/**
 * Valida webhook do Asaas (opcional - caso implementem assinatura)
 */
export function validateWebhookSignature(payload: string, signature: string): boolean {
  // TODO: Implementar validação de assinatura se Asaas fornecer
  // Por enquanto, retorna true (validação via IP whitelist)
  return true;
}
