import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, phone, cpf } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    if (cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf },
      })
      if (existingCpf) {
        return NextResponse.json(
          { error: "Este CPF já está cadastrado" },
          { status: 400 }
        )
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        cpf: cpf || null,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: "Conta criada com sucesso", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao registrar:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
