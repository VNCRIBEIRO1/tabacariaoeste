import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { reviewSchema } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      )
    }

    const parsed = reviewSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: session.user.id,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "Você já avaliou este produto" },
        { status: 400 }
      )
    }

    const data = parsed.data

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        approved: false, // Requires admin approval
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(
      { message: "Avaliação enviada e aguardando aprovação", review },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar avaliação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
