import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { bannerSchema } from "@/lib/validators"

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

    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    })

    if (!banner) {
      return NextResponse.json(
        { error: "Banner não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Erro ao buscar banner:", error)
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
    const parsed = bannerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.banner.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Banner não encontrado" },
        { status: 404 }
      )
    }

    const data = parsed.data

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: data.title,
        desktopImage: data.desktopImage,
        mobileImage: data.mobileImage,
        link: data.link,
        position: data.position,
        order: data.order,
        active: data.active,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Erro ao atualizar banner:", error)
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

    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    })

    if (!banner) {
      return NextResponse.json(
        { error: "Banner não encontrado" },
        { status: 404 }
      )
    }

    await prisma.banner.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Banner excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir banner:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
