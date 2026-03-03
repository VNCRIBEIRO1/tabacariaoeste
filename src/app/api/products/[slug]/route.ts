import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const product = await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: { where: { active: true } },
        category: {
          select: { id: true, name: true, slug: true },
        },
        reviews: {
          where: { approved: true },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0

    // Get related products (same category, exclude current)
    const relatedProducts = product.categoryId
      ? await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: { not: product.id },
            active: true,
          },
          take: 4,
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
            category: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { salesCount: "desc" },
        })
      : []

    return NextResponse.json({
      product: {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      },
      relatedProducts,
    })
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
