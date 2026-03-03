import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateOrderNumber } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  slug: true,
                  images: { take: 1, orderBy: { order: "asc" } },
                },
              },
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      orders,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Erro ao listar pedidos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const {
      items,
      couponCode,
      paymentMethod,
      shippingAddress,
      shippingCost = 0,
      notes,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "O pedido deve ter pelo menos um item" },
        { status: 400 }
      )
    }

    // Validate and fetch products
    const productIds = items.map((item: { productId: string }) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Um ou mais produtos não foram encontrados ou estão inativos" },
        { status: 400 }
      )
    }

    // Calculate totals and validate stock
    let subtotal = 0
    const orderItems: {
      productId: string
      productName: string
      variantInfo: string | null
      quantity: number
      unitPrice: number
      totalPrice: number
    }[] = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) continue

      // Check stock
      if (product.trackStock && product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}`,
          },
          { status: 400 }
        )
      }

      // Use promo price if active
      const now = new Date()
      let unitPrice = Number(product.price)
      if (
        product.promoPrice &&
        (!product.promoStart || now >= product.promoStart) &&
        (!product.promoEnd || now <= product.promoEnd)
      ) {
        unitPrice = Number(product.promoPrice)
      }

      const totalPrice = unitPrice * item.quantity
      subtotal += totalPrice

      orderItems.push({
        productId: product.id,
        productName: product.name,
        variantInfo: item.variantInfo || null,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      })
    }

    // Apply coupon discount
    let discount = 0
    let couponId: string | null = null

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      })

      if (coupon && coupon.active) {
        const now = new Date()
        const isValid =
          (!coupon.startDate || now >= coupon.startDate) &&
          (!coupon.endDate || now <= coupon.endDate) &&
          (!coupon.maxUses || coupon.usedCount < coupon.maxUses)

        if (isValid) {
          if (!coupon.minOrder || subtotal >= Number(coupon.minOrder)) {
            if (coupon.type === "PERCENTAGE") {
              discount = (subtotal * Number(coupon.value)) / 100
            } else {
              discount = Number(coupon.value)
            }
            discount = Math.min(discount, subtotal) // Don't exceed subtotal
            couponId = coupon.id
          }
        }
      }
    }

    const total = subtotal + Number(shippingCost) - discount
    const orderNumber = generateOrderNumber()

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          status: "AWAITING_PAYMENT",
          paymentMethod: paymentMethod || null,
          subtotal,
          shippingCost: Number(shippingCost),
          discount,
          total,
          couponId,
          couponCode: couponCode?.toUpperCase() || null,
          shippingAddress: shippingAddress || null,
          notes: notes || null,
          items: {
            create: orderItems,
          },
          history: {
            create: {
              status: "AWAITING_PAYMENT",
              note: "Pedido criado",
            },
          },
        },
        include: {
          items: true,
        },
      })

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      // Update product stock and sales count
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            salesCount: { increment: item.quantity },
            ...(products.find((p) => p.id === item.productId)?.trackStock
              ? { stock: { decrement: item.quantity } }
              : {}),
          },
        })
      }

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
