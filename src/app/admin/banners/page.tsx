import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function deleteBanner(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role)) return

  const id = formData.get("id") as string
  await prisma.banner.delete({ where: { id } })
  revalidatePath("/admin/banners")
}

const POSITION_LABELS: Record<string, string> = {
  HERO: "Hero (Principal)",
  INTERMEDIATE: "Intermediário",
  SIDEBAR: "Lateral",
}

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { order: "asc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Banners</h1>
          <p className="text-sm text-gray-500">
            {banners.length} banner{banners.length !== 1 ? "s" : ""} cadastrado{banners.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/banners?modal=new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Banner
          </Button>
        </Link>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">Nenhum banner cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => {
            const now = new Date()
            const isActive =
              banner.active &&
              (!banner.startDate || new Date(banner.startDate) <= now) &&
              (!banner.endDate || new Date(banner.endDate) >= now)

            return (
              <Card key={banner.id} className="overflow-hidden">
                <div className="relative aspect-[16/9] bg-gray-100">
                  {banner.desktopImage ? (
                    <Image
                      src={banner.desktopImage}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {isActive ? (
                      <Badge variant="success">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-stone-900">{banner.title}</h3>
                    <p className="text-xs text-gray-500">
                      {POSITION_LABELS[banner.position] || banner.position} · Ordem: {banner.order}
                    </p>
                  </div>

                  {banner.link && (
                    <p className="text-xs text-amber-700 truncate">{banner.link}</p>
                  )}

                  <div className="text-xs text-gray-500 space-y-0.5">
                    {banner.startDate && (
                      <p>Início: {formatDate(banner.startDate)}</p>
                    )}
                    {banner.endDate && (
                      <p>Fim: {formatDate(banner.endDate)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Link
                      href={`/admin/banners?modal=edit&id=${banner.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <form action={deleteBanner}>
                      <input type="hidden" name="id" value={banner.id} />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e: any) => {
                          if (
                            !confirm("Tem certeza que deseja excluir este banner?")
                          ) {
                            e.preventDefault()
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
