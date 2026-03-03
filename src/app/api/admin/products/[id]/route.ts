import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { productSchema } from "@/lib/validators"
import { slugify } from "@/lib/utils"

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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        _count: { select: { orderItems: true, reviews: true } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
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
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    // Check slug uniqueness if changed
    let slug = data.slug || slugify(data.name)
    if (slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({ where: { slug } })
      if (existingSlug && existingSlug.id !== params.id) {
        slug = `${slug}-${Date.now().toString(36)}`
      }
    }

    // Check SKU uniqueness if changed
    if (data.sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      })
      if (existingSku && existingSku.id !== params.id) {
        return NextResponse.json(
          { error: "SKU já existe" },
          { status: 400 }
        )
      }
    }

    // Handle images update: delete old and create new
    if (body.images) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } })
    }

    // Handle variants update: delete old and create new
    if (body.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
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
        images: { orderBy: { order: "asc" } },
        variants: true,
        category: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { _count: { select: { orderItems: true } } },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    // Soft delete if product has orders, hard delete otherwise
    if (product._count.orderItems > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { active: false },
      })
      return NextResponse.json({ message: "Produto desativado com sucesso" })
    }

    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Produto excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
