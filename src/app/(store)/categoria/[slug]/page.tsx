import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/store/product-card"
import { CategorySort } from "@/components/store/category-sort"
import Link from "next/link"
import { ChevronRight, Package } from "lucide-react"
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
    title: `${category.name} | Oeste Tabacaria`,
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
      <nav className="flex items-center gap-2 text-sm text-tobacco-500 mb-6">
        <Link href="/" className="hover:text-tobacco-700 transition-colors">Início</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-tobacco-900 font-medium">{category.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-tobacco-200 p-5 sticky top-24 shadow-sm">
            <h3 className="font-semibold text-tobacco-900 mb-4">Filtros</h3>

            {/* Subcategories */}
            {category.children.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-tobacco-700 mb-2">Subcategorias</h4>
                <ul className="space-y-1.5">
                  {category.children.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/categoria/${sub.slug}`}
                        className="text-sm text-tobacco-600 hover:text-tobacco-800 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sort - Client Component */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-tobacco-700 mb-2">Ordenar</h4>
              <CategorySort
                defaultSort={searchParams.sort || "newest"}
                slug={params.slug}
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-tobacco-900">{category.name}</h1>
              {category.description && (
                <p className="text-tobacco-600 mt-1 text-sm">{category.description}</p>
              )}
            </div>
            <span className="text-sm text-tobacco-500 bg-tobacco-100 px-3 py-1 rounded-full">
              {total} produto{total !== 1 && "s"}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-tobacco-50 rounded-2xl">
              <Package className="h-16 w-16 text-tobacco-300 mx-auto mb-4" />
              <p className="text-tobacco-600 mb-4 font-medium">Nenhum produto encontrado nesta categoria.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-tobacco-700 text-white px-6 py-2.5 rounded-full font-medium hover:bg-tobacco-800 transition-colors"
              >
                Voltar ao Início
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
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/categoria/${params.slug}?page=${p}${searchParams.sort ? `&sort=${searchParams.sort}` : ""}`}
                      className={`inline-flex items-center justify-center h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-tobacco-700 text-white shadow-md"
                          : "bg-white border border-tobacco-200 text-tobacco-700 hover:bg-tobacco-50"
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
