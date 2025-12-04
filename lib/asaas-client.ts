/**
 * Cliente Asaas para pagamentos
 * Documentação: https://docs.asaas.com/
 */

const ASAAS_API_URL = 'https://www.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

if (!ASAAS_API_KEY) {
  console.warn('⚠️ Asaas não configurado. Adicione ASAAS_API_KEY ao .env.local');
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  value: number;
  dueDate: string;
  description: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  status: 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'OVERDUE';
  invoiceUrl: string;
  invoiceNumber?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
}

/**
 * Cria ou busca cliente no Asaas
 */
export async function createOrGetCustomer(data: {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}): Promise<AsaasCustomer> {
  try {
    // Primeiro, tentar buscar cliente por email
    const searchResponse = await fetch(
      `${ASAAS_API_URL}/customers?email=${encodeURIComponent(data.email)}`,
      {
        method: 'GET',
        headers: {
          'access_token': ASAAS_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    const searchData = await searchResponse.json();

    if (searchData.data && searchData.data.length > 0) {
      console.log('[Asaas] Cliente encontrado:', data.email);
      return searchData.data[0];
    }

    // Se não encontrou, criar novo cliente
    console.log('[Asaas] Criando novo cliente:', data.email);
    
    const createResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Erro ao criar cliente: ${JSON.stringify(error)}`);
    }

    const customer = await createResponse.json();
    console.log('[Asaas] ✅ Cliente criado:', customer.id);
    
    return customer;
  } catch (error) {
    console.error('[Asaas] Erro ao criar/buscar cliente:', error);
    throw error;
  }
}

/**
 * Cria cobrança PIX
 */
export async function createPixPayment(data: {
  customerId: string;
  value: number;
  description: string;
  externalReference?: string;
}): Promise<AsaasPayment> {
  try {
    console.log('[Asaas] Criando cobrança PIX:', data.value);

    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: data.customerId,
        billingType: 'PIX',
        value: data.value,
        dueDate: new Date().toISOString().split('T')[0], // Hoje
        description: data.description,
        externalReference: data.externalReference,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar cobrança: ${JSON.stringify(error)}`);
    }

    const payment = await response.json();
    
    // Buscar QR Code PIX
    const pixResponse = await fetch(
      `${ASAAS_API_URL}/payments/${payment.id}/pixQrCode`,
      {
        method: 'GET',
        headers: {
          'access_token': ASAAS_API_KEY!,
        },
      }
    );

    if (pixResponse.ok) {
      const pixData = await pixResponse.json();
      payment.pixQrCode = pixData.encodedImage;
      payment.pixCopyPaste = pixData.payload;
    }

    console.log('[Asaas] ✅ Cobrança PIX criada:', payment.id);
    
    return payment;
  } catch (error) {
    console.error('[Asaas] Erro ao criar cobrança PIX:', error);
    throw error;
  }
}

/**
 * Cria cobrança por Cartão de Crédito
 */
export async function createCreditCardPayment(data: {
  customerId: string;
  value: number;
  description: string;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
  externalReference?: string;
}): Promise<AsaasPayment> {
  try {
    console.log('[Asaas] Criando cobrança por cartão:', data.value);

    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: data.customerId,
        billingType: 'CREDIT_CARD',
        value: data.value,
        dueDate: new Date().toISOString().split('T')[0],
        description: data.description,
        externalReference: data.externalReference,
        creditCard: data.creditCard,
        creditCardHolderInfo: data.creditCardHolderInfo,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao processar cartão: ${JSON.stringify(error)}`);
    }

    const payment = await response.json();
    console.log('[Asaas] ✅ Cobrança processada:', payment.id);
    
    return payment;
  } catch (error) {
    console.error('[Asaas] Erro ao processar cartão:', error);
    throw error;
  }
}

/**
 * Verifica status de pagamento
 */
export async function getPaymentStatus(paymentId: string): Promise<AsaasPayment> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'access_token': ASAAS_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar status do pagamento');
    }

    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error('[Asaas] Erro ao buscar pagamento:', error);
    throw error;
  }
}

/**
 * Cria cobrança completa (Nossa Timeline Premium)
 * Simplifica o processo: cria cliente + cobrança PIX
 */
export async function createPremiumPayment(data: {
  slug: string;
  customerName: string;
  customerEmail: string;
  customerCpf?: string;
  customerPhone?: string;
}): Promise<{
  paymentId: string;
  invoiceUrl: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
}> {
  try {
    console.log(`[Asaas] Criando pagamento premium para: ${data.slug}`);

    // 1. Criar ou buscar cliente
    const customer = await createOrGetCustomer({
      name: data.customerName,
      email: data.customerEmail,
      cpfCnpj: data.customerCpf,
      phone: data.customerPhone,
    });

    // 2. Criar cobrança PIX de R$ 9,90
    const payment = await createPixPayment({
      customerId: customer.id,
      value: 9.90,
      description: `Nossa Timeline Premium - ${data.slug}`,
      externalReference: data.slug,
    });

    console.log(`[Asaas] ✅ Pagamento criado: ${payment.id}`);

    return {
      paymentId: payment.id,
      invoiceUrl: payment.invoiceUrl,
      pixQrCode: payment.pixQrCode,
      pixCopyPaste: payment.pixCopyPaste,
    };
  } catch (error) {
    console.error('[Asaas] Erro ao criar pagamento premium:', error);
    throw error;
  }
}
