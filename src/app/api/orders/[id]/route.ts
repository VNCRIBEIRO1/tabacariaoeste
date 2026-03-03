import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: { take: 1, orderBy: { order: "asc" } },
              },
            },
          },
        },
        coupon: {
          select: { code: true, type: true, value: true },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    // Check ownership - must be the order owner or admin
    const isOwner = order.userId === session.user.id
    const isAdminUser = ADMIN_ROLES.includes(session.user.role)

    if (!isOwner && !isAdminUser) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
