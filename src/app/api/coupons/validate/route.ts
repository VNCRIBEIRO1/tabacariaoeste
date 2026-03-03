import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { code, subtotal } = body

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Código do cupom é obrigatório" },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    // Check if active
    if (!coupon.active) {
      return NextResponse.json({
        valid: false,
        message: "Este cupom não está mais ativo",
      })
    }

    // Check date range
    const now = new Date()
    if (coupon.startDate && now < coupon.startDate) {
      return NextResponse.json({
        valid: false,
        message: "Este cupom ainda não está disponível",
      })
    }

    if (coupon.endDate && now > coupon.endDate) {
      return NextResponse.json({
        valid: false,
        message: "Este cupom expirou",
      })
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        valid: false,
        message: "Este cupom atingiu o limite de uso",
      })
    }

    // Check max uses per user
    if (coupon.maxUsesPerUser) {
      const userUsageCount = await prisma.order.count({
        where: {
          userId: session.user.id,
          couponId: coupon.id,
          status: { notIn: ["CANCELLED", "RETURNED"] },
        },
      })

      if (userUsageCount >= coupon.maxUsesPerUser) {
        return NextResponse.json({
          valid: false,
          message: "Você já utilizou este cupom o número máximo de vezes",
        })
      }
    }

    // Check minimum order value
    if (coupon.minOrder && subtotal && Number(subtotal) < Number(coupon.minOrder)) {
      return NextResponse.json({
        valid: false,
        message: `Pedido mínimo de R$ ${Number(coupon.minOrder).toFixed(2)} para usar este cupom`,
      })
    }

    // Calculate discount
    let discountValue = 0
    if (coupon.type === "PERCENTAGE") {
      discountValue = subtotal
        ? (Number(subtotal) * Number(coupon.value)) / 100
        : Number(coupon.value)
    } else {
      discountValue = Number(coupon.value)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        discountValue: Math.round(discountValue * 100) / 100,
      },
    })
  } catch (error) {
    console.error("Erro ao validar cupom:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
