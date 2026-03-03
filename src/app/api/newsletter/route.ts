import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { newsletterSchema } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = newsletterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "Este email já está inscrito na newsletter" },
          { status: 200 }
        )
      }

      // Reactivate subscription
      await prisma.newsletter.update({
        where: { email },
        data: { active: true },
      })

      return NextResponse.json(
        { message: "Inscrição reativada com sucesso!" },
        { status: 200 }
      )
    }

    await prisma.newsletter.create({
      data: { email },
    })

    return NextResponse.json(
      { message: "Inscrito na newsletter com sucesso!" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao inscrever na newsletter:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
