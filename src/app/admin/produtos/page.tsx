import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

interface SearchParams {
  search?: string
  category?: string
  status?: string
  page?: string
}

async function deleteProduct(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role)) return

  const id = formData.get("id") as string
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/produtos")
}

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const search = searchParams.search || ""
  const categoryFilter = searchParams.category || ""
  const statusFilter = searchParams.status || ""
  const page = parseInt(searchParams.page || "1")
  const perPage = 15

  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ]
  }

  if (categoryFilter) {
    where.categoryId = categoryFilter
  }

  if (statusFilter === "active") {
    where.active = true
  } else if (statusFilter === "inactive") {
    where.active = false
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Produtos</h1>
          <p className="text-sm text-gray-500">
            {total} produto{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <form method="GET" className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Buscar por nome ou SKU..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              name="category"
              defaultValue={categoryFilter}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Imagem</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Categoria</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Preço</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Estoque</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-stone-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {product.category?.name || "—"}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-stone-900">
                          {formatPrice(Number(product.price))}
                        </p>
                        {product.promoPrice && (
                          <p className="text-xs text-green-600">
                            Promo: {formatPrice(Number(product.promoPrice))}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock <= product.minStock
                              ? "text-red-600"
                              : "text-stone-900"
                          }`}
                        >
                          {product.stock}
                        </span>
                        {product.stock <= product.minStock && (
                          <p className="text-xs text-red-500">Estoque baixo</p>
                        )}
                      </td>
                      <td className="p-4">
                        {product.active ? (
                          <Badge variant="success">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/produtos/${product.id}/editar`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <Button
                              variant="ghost"
                              size="icon"
                              type="submit"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e: any) => {
                                if (!confirm("Tem certeza que deseja excluir este produto?")) {
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

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/produtos?page=${page - 1}&search=${search}&category=${categoryFilter}&status=${statusFilter}`}
            >
              <Button variant="outline" size="sm">
                Anterior
              </Button>
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/produtos?page=${p}&search=${search}&category=${categoryFilter}&status=${statusFilter}`}
            >
              <Button
                variant={p === page ? "default" : "outline"}
                size="sm"
              >
                {p}
              </Button>
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/admin/produtos?page=${page + 1}&search=${search}&category=${categoryFilter}&status=${statusFilter}`}
            >
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
