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

export async function GET(request: NextRequest) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")

    const now = new Date()
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(now.getFullYear(), now.getMonth(), 1) // Start of current month
    const endDate = endDateParam
      ? new Date(endDateParam)
      : now

    // Ensure endDate includes the full day
    endDate.setHours(23, 59, 59, 999)

    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    // Total revenue (only paid/delivered orders, excluding cancelled/returned)
    const revenueResult = await prisma.order.aggregate({
      where: {
        ...dateFilter,
        status: {
          notIn: ["CANCELLED", "RETURNED"],
        },
      },
      _sum: { total: true },
      _count: true,
    })

    const totalRevenue = Number(revenueResult._sum.total || 0)
    const totalOrders = revenueResult._count

    // Average ticket
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // New customers in period
    const newCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
        ...dateFilter,
      },
    })

    // Top 5 products by sales count
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      where: {
        order: {
          ...dateFilter,
          status: { notIn: ["CANCELLED", "RETURNED"] },
        },
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
    })

    // Top categories
    const topCategoriesRaw = await prisma.orderItem.findMany({
      where: {
        order: {
          ...dateFilter,
          status: { notIn: ["CANCELLED", "RETURNED"] },
        },
      },
      select: {
        quantity: true,
        totalPrice: true,
        product: {
          select: {
            category: { select: { id: true, name: true } },
          },
        },
      },
    })

    const categoryMap = new Map<
      string,
      { id: string; name: string; totalSales: number; totalRevenue: number }
    >()

    topCategoriesRaw.forEach((item) => {
      const catId = item.product.category?.id || "uncategorized"
      const catName = item.product.category?.name || "Sem categoria"
      const existing = categoryMap.get(catId) || {
        id: catId,
        name: catName,
        totalSales: 0,
        totalRevenue: 0,
      }
      existing.totalSales += item.quantity
      existing.totalRevenue += Number(item.totalPrice)
      categoryMap.set(catId, existing)
    })

    const topCategories = Array.from(categoryMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)

    // Daily sales for the period
    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })

    const dailySalesMap = new Map<string, { date: string; revenue: number; orders: number }>()

    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split("T")[0]
      const existing = dailySalesMap.get(dateKey) || {
        date: dateKey,
        revenue: 0,
        orders: 0,
      }
      existing.revenue += Number(order.total)
      existing.orders += 1
      dailySalesMap.set(dateKey, existing)
    })

    const dailySales = Array.from(dailySalesMap.values())

    // Order status distribution
    const statusDistribution = await prisma.order.groupBy({
      by: ["status"],
      where: dateFilter,
      _count: true,
    })

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageTicket: Math.round(averageTicket * 100) / 100,
      newCustomers,
      topProducts: topProducts.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        totalSold: p._sum.quantity || 0,
        totalRevenue: Number(p._sum.totalPrice || 0),
      })),
      topCategories,
      dailySales,
      statusDistribution: statusDistribution.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao gerar relatório:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
