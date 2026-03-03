import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function deleteCategory(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role)) return

  const id = formData.get("id") as string
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categorias")
}

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      parent: { select: { name: true } },
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Categorias</h1>
          <p className="text-sm text-gray-500">
            {categories.length} categoria{categories.length !== 1 ? "s" : ""} cadastrada{categories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/categorias?modal=new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Imagem</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Slug</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Pai</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Produtos</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Ordem</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      <FolderTree className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FolderTree className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-stone-900">{category.name}</td>
                      <td className="p-4 text-sm text-gray-500">{category.slug}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {category.parent?.name || "—"}
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{category._count.products}</Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{category.order}</td>
                      <td className="p-4">
                        {category.active ? (
                          <Badge variant="success">Ativa</Badge>
                        ) : (
                          <Badge variant="secondary">Inativa</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/categorias?modal=edit&id=${category.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <form action={deleteCategory}>
                            <input type="hidden" name="id" value={category.id} />
                            <Button
                              variant="ghost"
                              size="icon"
                              type="submit"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e: any) => {
                                if (
                                  !confirm(
                                    "Tem certeza que deseja excluir esta categoria?"
                                  )
                                ) {
                                  e.preventDefault()
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
