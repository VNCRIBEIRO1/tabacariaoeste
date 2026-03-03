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

export async function GET(request: NextRequest) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Erro ao listar categorias:", error)
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
    const parsed = categorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    let slug = data.slug || slugify(data.name)

    // Ensure unique slug
    const existingSlug = await prisma.category.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const category = await prisma.category.create({
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

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
