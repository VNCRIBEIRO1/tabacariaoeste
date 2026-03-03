import { Search, SlidersHorizontal } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/store/product-card"

interface BuscaPageProps {
  searchParams: { q?: string; page?: string }
}

export async function generateMetadata({ searchParams }: BuscaPageProps) {
  const query = searchParams.q || ""
  return {
    title: query ? `Busca: ${query} | Oeste Tabacaria` : "Busca | Oeste Tabacaria",
    description: `Resultados de busca para "${query}" na Oeste Tabacaria.`,
  }
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const query = searchParams.q || ""
  const page = parseInt(searchParams.page || "1")
  const perPage = 12

  const where = query
    ? {
        active: true,
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
          { brand: { contains: query, mode: "insensitive" as const } },
          { tags: { has: query.toLowerCase() } },
        ],
      }
    : { active: true }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: { select: { name: true } },
      },
      orderBy: { salesCount: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-tobacco-700" />
          <h1 className="text-2xl font-bold text-tobacco-900">
            {query ? `Resultados para "${query}"` : "Buscar Produtos"}
          </h1>
        </div>
        <p className="text-tobacco-500">
          {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      {/* Results */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            <div className="flex justify-center items-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/busca?q=${encodeURIComponent(query)}&page=${p}`}
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-tobacco-700 text-white"
                      : "bg-white border border-tobacco-200 text-tobacco-700 hover:bg-tobacco-50"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <SlidersHorizontal className="h-16 w-16 text-tobacco-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-tobacco-700 mb-2">
            Nenhum produto encontrado
          </h2>
          <p className="text-tobacco-500 max-w-md mx-auto">
            {query
              ? `Não encontramos resultados para "${query}". Tente buscar com outros termos.`
              : "Digite algo no campo de busca para encontrar produtos."}
          </p>
        </div>
      )}
    </div>
  )
}
