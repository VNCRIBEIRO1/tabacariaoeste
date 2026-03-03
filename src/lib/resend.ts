// Email service using Resend for Oeste Tabacaria

const RESEND_API_KEY = process.env.RESEND_API_KEY!
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "Oeste Tabacaria <noreply@oestetabacaria.com.br>"

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Resend error: ${JSON.stringify(err)}`)
  }

  return res.json()
}

// Email templates
export function orderConfirmationEmail(order: {
  orderNumber: string
  customerName: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">R$ ${item.price.toFixed(2)}</td>
    </tr>`
    )
    .join("")

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#b45309;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;">Oeste Tabacaria</h1>
      </div>
      <div style="padding:20px;">
        <h2>Pedido Confirmado!</h2>
        <p>Ola ${order.customerName},</p>
        <p>Seu pedido <strong>#${order.orderNumber}</strong> foi recebido com sucesso.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px;text-align:left;">Produto</th>
              <th style="padding:8px;text-align:center;">Qtd</th>
              <th style="padding:8px;text-align:right;">Preco</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px;font-weight:bold;">Total</td>
              <td style="padding:8px;text-align:right;font-weight:bold;">R$ ${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p>Voce pode acompanhar seu pedido na sua <a href="${process.env.NEXT_PUBLIC_APP_URL}/conta" style="color:#b45309;">area do cliente</a>.</p>
      </div>
      <div style="background:#1c1917;color:#fff;padding:15px;text-align:center;font-size:12px;">
        <p>Oeste Tabacaria - Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP</p>
        <p>(18) 98817-6442</p>
      </div>
    </div>
  `
}

export function orderStatusEmail(order: {
  orderNumber: string
  customerName: string
  status: string
  trackingCode?: string
}) {
  const statusLabels: Record<string, string> = {
    CONFIRMED: "Pagamento Confirmado",
    PROCESSING: "Em Preparacao",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  }

  const statusLabel = statusLabels[order.status] || order.status
  const trackingHtml = order.trackingCode
    ? `<p>Codigo de rastreio: <strong>${order.trackingCode}</strong></p>
       <p><a href="https://www.linkcorreios.com.br/?id=${order.trackingCode}" style="color:#b45309;">Rastrear pedido</a></p>`
    : ""

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#b45309;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;">Oeste Tabacaria</h1>
      </div>
      <div style="padding:20px;">
        <h2>Atualizacao do Pedido</h2>
        <p>Ola ${order.customerName},</p>
        <p>Seu pedido <strong>#${order.orderNumber}</strong> teve o status atualizado para:</p>
        <div style="background:#fef3c7;border:1px solid #f59e0b;padding:15px;border-radius:8px;text-align:center;margin:20px 0;">
          <strong style="font-size:18px;">${statusLabel}</strong>
        </div>
        ${trackingHtml}
        <p>Acompanhe seu pedido na sua <a href="${process.env.NEXT_PUBLIC_APP_URL}/conta" style="color:#b45309;">area do cliente</a>.</p>
      </div>
      <div style="background:#1c1917;color:#fff;padding:15px;text-align:center;font-size:12px;">
        <p>Oeste Tabacaria - Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP</p>
      </div>
    </div>
  `
}

export function welcomeEmail(customerName: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#b45309;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;">Oeste Tabacaria</h1>
      </div>
      <div style="padding:20px;">
        <h2>Bem-vindo(a)!</h2>
        <p>Ola ${customerName},</p>
        <p>Sua conta na <strong>Oeste Tabacaria</strong> foi criada com sucesso!</p>
        <p>Agora voce pode:</p>
        <ul>
          <li>Acompanhar seus pedidos</li>
          <li>Salvar enderecos de entrega</li>
          <li>Criar lista de desejos</li>
          <li>Avaliar produtos</li>
        </ul>
        <div style="text-align:center;margin:20px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background:#b45309;color:#fff;padding:12px 30px;text-decoration:none;border-radius:8px;display:inline-block;">Explorar Produtos</a>
        </div>
      </div>
      <div style="background:#1c1917;color:#fff;padding:15px;text-align:center;font-size:12px;">
        <p>Oeste Tabacaria - Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP</p>
      </div>
    </div>
  `
}

export function newsletterWelcomeEmail() {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#b45309;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;">Oeste Tabacaria</h1>
      </div>
      <div style="padding:20px;">
        <h2>Newsletter Confirmada!</h2>
        <p>Voce agora recebera nossas melhores ofertas e novidades diretamente no seu e-mail.</p>
        <div style="text-align:center;margin:20px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background:#b45309;color:#fff;padding:12px 30px;text-decoration:none;border-radius:8px;display:inline-block;">Ver Ofertas</a>
        </div>
      </div>
      <div style="background:#1c1917;color:#fff;padding:15px;text-align:center;font-size:12px;">
        <p style="margin:0;">Para cancelar, clique <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe" style="color:#aaa;">aqui</a></p>
      </div>
    </div>
  `
}
