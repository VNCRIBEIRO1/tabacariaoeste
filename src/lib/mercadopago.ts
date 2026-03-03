// MercadoPago integration for Oeste Tabacaria
// Uses MercadoPago SDK v2 for payment processing

interface PaymentItem {
  title: string
  quantity: number
  unit_price: number
  currency_id?: string
}

interface PayerInfo {
  email: string
  name: string
  surname: string
  phone?: string
}

interface PreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
}

interface PaymentResponse {
  id: number
  status: string
  status_detail: string
  payment_method_id: string
  payment_type_id: string
  transaction_amount: number
  date_approved: string | null
  payer: {
    email: string
  }
}

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!
const MERCADOPAGO_API = "https://api.mercadopago.com"

const headers = {
  Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
}

export async function createPreference(
  items: PaymentItem[],
  payer: PayerInfo,
  orderId: string,
  orderNumber: string
): Promise<PreferenceResponse> {
  const body = {
    items: items.map((item) => ({
      ...item,
      currency_id: item.currency_id || "BRL",
    })),
    payer: {
      email: payer.email,
      name: payer.name,
      surname: payer.surname,
    },
    external_reference: orderId,
    statement_descriptor: "OESTE TABACARIA",
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/conta/pedidos/${orderId}?status=approved`,
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/conta/pedidos/${orderId}?status=rejected`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/conta/pedidos/${orderId}?status=pending`,
    },
    auto_return: "approved",
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    metadata: {
      order_id: orderId,
      order_number: orderNumber,
    },
  }

  const res = await fetch(`${MERCADOPAGO_API}/checkout/preferences`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`MercadoPago error: ${JSON.stringify(err)}`)
  }

  return res.json()
}

export async function getPayment(paymentId: string | number): Promise<PaymentResponse> {
  const res = await fetch(`${MERCADOPAGO_API}/v1/payments/${paymentId}`, { headers })

  if (!res.ok) {
    throw new Error(`MercadoPago: payment ${paymentId} not found`)
  }

  return res.json()
}

export async function createPixPayment(
  amount: number,
  payer: PayerInfo,
  orderId: string,
  description: string
) {
  const body = {
    transaction_amount: amount,
    description,
    payment_method_id: "pix",
    payer: {
      email: payer.email,
      first_name: payer.name,
      last_name: payer.surname,
    },
    external_reference: orderId,
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
  }

  const res = await fetch(`${MERCADOPAGO_API}/v1/payments`, {
    method: "POST",
    headers: {
      ...headers,
      "X-Idempotency-Key": `pix-${orderId}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`MercadoPago PIX error: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  return {
    id: data.id,
    status: data.status,
    qrCode: data.point_of_interaction?.transaction_data?.qr_code,
    qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64,
    ticketUrl: data.point_of_interaction?.transaction_data?.ticket_url,
  }
}

// Map MercadoPago status to internal order status
export function mapPaymentStatus(mpStatus: string): string {
  const statusMap: Record<string, string> = {
    approved: "CONFIRMED",
    pending: "AWAITING_PAYMENT",
    in_process: "AWAITING_PAYMENT",
    rejected: "CANCELLED",
    refunded: "CANCELLED",
    cancelled: "CANCELLED",
    charged_back: "CANCELLED",
  }
  return statusMap[mpStatus] || "AWAITING_PAYMENT"
}
