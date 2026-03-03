import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"]

async function isAdmin() {
  const session = await auth()
  if (!session?.user) return null
  if (!ADMIN_ROLES.includes(session.user.role)) return null
  return session
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cpf: true,
          },
        },
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
        coupon: true,
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

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
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
    const { status, trackingCode, invoiceNumber, invoiceFile, notes } = body

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (trackingCode !== undefined) updateData.trackingCode = trackingCode
    if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber
    if (invoiceFile !== undefined) updateData.invoiceFile = invoiceFile
    if (notes !== undefined) updateData.notes = notes

    if (status && status !== order.status) {
      updateData.status = status
      // Create status history entry
      await prisma.orderStatusHistory.create({
        data: {
          orderId: params.id,
          status,
          note: body.statusNote || null,
        },
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
        history: { orderBy: { createdAt: "desc" } },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
