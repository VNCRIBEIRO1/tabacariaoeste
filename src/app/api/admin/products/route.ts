import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { productSchema } from "@/lib/validators"
import { slugify } from "@/lib/utils"
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
    const categoryId = searchParams.get("categoryId") || ""
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (status === "active") where.active = true
    if (status === "inactive") where.active = false

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
          category: { select: { id: true, name: true } },
          _count: { select: { orderItems: true, reviews: true } },
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
    console.error("Erro ao listar produtos (admin):", error)
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
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Auto-generate slug if not provided or generate from name
    let slug = data.slug || slugify(data.name)

    // Ensure unique slug
    const existingSlug = await prisma.product.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Check unique SKU
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    })
    if (existingSku) {
      return NextResponse.json(
        { error: "SKU já existe" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId || null,
        subcategoryId: data.subcategoryId || null,
        brand: data.brand,
        origin: data.origin,
        tags: data.tags,
        price: data.price,
        costPrice: data.costPrice,
        promoPrice: data.promoPrice,
        promoStart: data.promoStart ? new Date(data.promoStart) : null,
        promoEnd: data.promoEnd ? new Date(data.promoEnd) : null,
        stock: data.stock,
        minStock: data.minStock,
        trackStock: data.trackStock,
        active: data.active,
        weight: data.weight,
        height: data.height,
        width: data.width,
        length: data.length,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featured: data.featured,
        images: body.images?.length
          ? {
              create: body.images.map(
                (img: { url: string; alt?: string; order?: number; isPrimary?: boolean }, index: number) => ({
                  url: img.url,
                  alt: img.alt || data.name,
                  order: img.order ?? index,
                  isPrimary: img.isPrimary ?? index === 0,
                })
              ),
            }
          : undefined,
        variants: body.variants?.length
          ? {
              create: body.variants.map(
                (v: { name: string; value: string; sku?: string; price?: number; stock?: number }) => ({
                  name: v.name,
                  value: v.value,
                  sku: v.sku,
                  price: v.price,
                  stock: v.stock ?? 0,
                })
              ),
            }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
