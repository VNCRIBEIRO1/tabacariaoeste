import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { categorySchema } from "@/lib/validators"
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Erro ao buscar categoria:", error)
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
    const parsed = categorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const existing = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    let slug = data.slug || slugify(data.name)
    if (slug !== existing.slug) {
      const existingSlug = await prisma.category.findUnique({ where: { slug } })
      if (existingSlug && existingSlug.id !== params.id) {
        slug = `${slug}-${Date.now().toString(36)}`
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        icon: data.icon,
        parentId: data.parentId || null,
        order: data.order,
        active: data.active,
      },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error)
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true, children: true } } },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir uma categoria com produtos associados" },
        { status: 400 }
      )
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir uma categoria com subcategorias" },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Categoria excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
