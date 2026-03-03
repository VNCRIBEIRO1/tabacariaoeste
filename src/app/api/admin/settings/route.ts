import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"]

async function isAdmin() {
  const session = await auth()
  if (!session?.user) return null
  if (!ADMIN_ROLES.includes(session.user.role)) return null
  return session
}

export async function GET() {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    let settings = await prisma.storeSettings.findFirst()

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: "Oeste Tabacaria",
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    let settings = await prisma.storeSettings.findFirst()

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: "Oeste Tabacaria",
          ...body,
        },
      })
    } else {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: body,
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
