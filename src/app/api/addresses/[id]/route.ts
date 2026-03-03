import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { addressSchema } from "@/lib/validators"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = addressSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Check ownership
    const existing = await prisma.address.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Endereço não encontrado" },
        { status: 404 }
      )
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const data = parsed.data

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: { not: params.id },
        },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        label: data.label,
        recipientName: data.recipientName,
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        isDefault: data.isDefault,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error)
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
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const address = await prisma.address.findUnique({
      where: { id: params.id },
    })

    if (!address) {
      return NextResponse.json(
        { error: "Endereço não encontrado" },
        { status: 404 }
      )
    }

    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    await prisma.address.delete({ where: { id: params.id } })

    // If the deleted address was default, set another as default
    if (address.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ message: "Endereço excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir endereço:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
