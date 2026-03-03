import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { couponSchema } from "@/lib/validators"

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

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { orders: true } },
      },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Erro ao buscar cupom:", error)
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
    const parsed = couponSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.coupon.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    const data = parsed.data

    // Check code uniqueness if changed
    if (data.code !== existing.code) {
      const existingCode = await prisma.coupon.findUnique({
        where: { code: data.code },
      })
      if (existingCode) {
        return NextResponse.json(
          { error: "Código de cupom já existe" },
          { status: 400 }
        )
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrder: data.minOrder,
        maxUses: data.maxUses,
        maxUsesPerUser: data.maxUsesPerUser,
        active: data.active,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        categoryIds: data.categoryIds,
        productIds: data.productIds,
      },
    })

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Erro ao atualizar cupom:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: { _count: { select: { orders: true } } },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    if (coupon._count.orders > 0) {
      // Soft delete - just deactivate
      await prisma.coupon.update({
        where: { id: params.id },
        data: { active: false },
      })
      return NextResponse.json({ message: "Cupom desativado com sucesso" })
    }

    await prisma.coupon.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Cupom excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir cupom:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
