import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"]

async function isAdmin() {
  const session = await auth()
  if (!session?.user) return null
  if (!ADMIN_ROLES.includes(session.user.role)) return null
  return session
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const session = await isAdmin()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use: JPEG, PNG, WebP, GIF ou SVG" },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo: 5MB" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg"
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)

    const url = `/uploads/${uniqueName}`

    return NextResponse.json({ url, filename: uniqueName }, { status: 201 })
  } catch (error) {
    console.error("Erro ao fazer upload:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
