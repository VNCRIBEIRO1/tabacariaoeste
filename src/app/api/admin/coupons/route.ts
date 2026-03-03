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

export async function GET(request: NextRequest) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true } },
      },
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Erro ao listar cupons:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const data = parsed.data

    // Check unique code
    const existingCode = await prisma.coupon.findUnique({
      where: { code: data.code },
    })
    if (existingCode) {
      return NextResponse.json(
        { error: "Código de cupom já existe" },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.create({
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

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar cupom:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
