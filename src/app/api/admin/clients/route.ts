import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Prisma } from "@prisma/client"

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
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {
      role: "CUSTOMER",
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { cpf: { contains: search, mode: "insensitive" } },
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          blocked: true,
          createdAt: true,
          _count: { select: { orders: true } },
          orders: {
            select: { total: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    // Calculate total spent per customer
    const customersWithStats = customers.map((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      )
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
        blocked: customer.blocked,
        createdAt: customer.createdAt,
        orderCount: customer._count.orders,
        totalSpent,
      }
    })

    return NextResponse.json({
      customers: customersWithStats,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Erro ao listar clientes:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
