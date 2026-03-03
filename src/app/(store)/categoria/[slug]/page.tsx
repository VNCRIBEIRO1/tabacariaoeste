import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
  searchParams: { page?: string; sort?: string; minPrice?: string; maxPrice?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })
  if (!category) return { title: "Categoria não encontrada" }
  return {
    title: category.name,
    description: category.description || `Produtos da categoria ${category.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug, active: true },
    include: { children: { where: { active: true } } },
  })

  if (!category) notFound()

  const page = parseInt(searchParams.page || "1")
  const perPage = 12
  const skip = (page - 1) * perPage

  const sortOptions: Record<string, object> = {
    newest: { createdAt: "desc" },
    "price-asc": { price: "asc" },
    "price-desc": { price: "desc" },
    bestsellers: { salesCount: "desc" },
  }
  const orderBy = sortOptions[searchParams.sort || "newest"] || { createdAt: "desc" }

  const where: any = {
    active: true,
    OR: [
      { categoryId: category.id },
      { subcategoryId: category.id },
    ],
  }

  if (searchParams.minPrice) {
    where.price = { ...where.price, gte: parseFloat(searchParams.minPrice) }
  }
  if (searchParams.maxPrice) {
    where.price = { ...where.price, lte: parseFloat(searchParams.maxPrice) }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true } },
      },
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">Início</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-stone-900 font-medium">{category.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border p-4 sticky top-24">
            <h3 className="font-semibold text-stone-900 mb-4">Filtros</h3>

            {/* Subcategories */}
            {category.children.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Subcategorias</h4>
                <ul className="space-y-1">
                  {category.children.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/categoria/${sub.slug}`}
                        className="text-sm text-gray-600 hover:text-amber-700"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sort */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ordenar</h4>
              <select
                className="w-full text-sm border rounded-md p-2"
                defaultValue={searchParams.sort || "newest"}
                onChange={(e) => {
                  const url = new URL(window.location.href)
                  url.searchParams.set("sort", e.target.value)
                  url.searchParams.delete("page")
                  window.location.href = url.toString()
                }}
              >
                <option value="newest">Mais Recentes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="bestsellers">Mais Vendidos</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-stone-900">{category.name}</h1>
            <span className="text-sm text-gray-500">{total} produto(s)</span>
          </div>

          {category.description && (
            <p className="text-gray-600 mb-6">{category.description}</p>
          )}

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Nenhum produto encontrado nesta categoria.</p>
              <Link href="/">
                <Button variant="outline">Voltar ao Início</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/categoria/${params.slug}?page=${p}${searchParams.sort ? `&sort=${searchParams.sort}` : ""}`}
                      className={`px-3 py-1 rounded text-sm ${
                        p === page
                          ? "bg-amber-700 text-white"
                          : "bg-white border hover:bg-amber-50"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
