import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"]

const VALID_STATUSES = [
  "AWAITING_PAYMENT",
  "PAID",
  "SEPARATING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const

const statusUpdateSchema = z.object({
  status: z.enum(VALID_STATUSES),
  comment: z.string().optional(),
})

async function isAdmin() {
  const session = await auth()
  if (!session?.user) return null
  if (!ADMIN_ROLES.includes(session.user.role)) return null
  return session
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = statusUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { status, comment } = parsed.data

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    if (order.status === status) {
      return NextResponse.json(
        { error: "O pedido já está com este status" },
        { status: 400 }
      )
    }

    // Create status history entry and update order in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: {
          orderId: params.id,
          status,
          note: comment || null,
        },
      })

      return tx.order.update({
        where: { id: params.id },
        data: { status },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          history: { orderBy: { createdAt: "desc" } },
        },
      })
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
