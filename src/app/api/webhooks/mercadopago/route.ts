import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPayment, mapPaymentStatus } from "@/lib/mercadopago"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // MercadoPago sends different notification types
    if (body.type === "payment" || body.action === "payment.updated") {
      const paymentId = body.data?.id || body.id
      if (!paymentId) {
        return NextResponse.json({ received: true })
      }

      const payment = await getPayment(paymentId)
      const orderId = payment.external_reference

      if (!orderId) {
        console.error("No external_reference in payment", paymentId)
        return NextResponse.json({ received: true })
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      })

      if (!order) {
        console.error("Order not found for payment", orderId)
        return NextResponse.json({ received: true })
      }

      const newStatus = mapPaymentStatus(payment.status)

      if (order.status !== newStatus) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: newStatus as any,
              paymentId: payment.id.toString(),
            },
          }),
          prisma.orderStatusHistory.create({
            data: {
              orderId,
              status: newStatus as any,
              comment: `Pagamento ${payment.status} via MercadoPago (${payment.payment_method_id})`,
            },
          }),
        ])
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    // Always return 200 to MercadoPago to avoid retries
    return NextResponse.json({ received: true })
  }
}
