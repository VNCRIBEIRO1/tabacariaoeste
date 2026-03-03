import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Erro ao buscar lista de desejos:", error)
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
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
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

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { message: "Produto já está na lista de desejos" },
        { status: 200 }
      )
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
          },
        },
      },
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error("Erro ao adicionar à lista de desejos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Produto não está na lista de desejos" },
        { status: 404 }
      )
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    return NextResponse.json({ message: "Produto removido da lista de desejos" })
  } catch (error) {
    console.error("Erro ao remover da lista de desejos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
