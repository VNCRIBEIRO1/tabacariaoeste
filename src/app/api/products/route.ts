import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const featured = searchParams.get("featured")
    const onPromo = searchParams.get("onPromo")
    const sort = searchParams.get("sort") || "newest"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      active: true,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (featured === "true") {
      where.featured = true
    }

    if (onPromo === "true") {
      where.promoPrice = { not: null }
      where.promoEnd = { gte: new Date() }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "name":
        orderBy = { name: "asc" }
        break
      case "bestseller":
        orderBy = { salesCount: "desc" }
        break
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            take: 1,
            orderBy: { order: "asc" },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Erro ao listar produtos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
