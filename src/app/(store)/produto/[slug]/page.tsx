import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, AlertTriangle } from "lucide-react"
// Badge replaced with inline styling
import { formatPrice, calculateDiscount, isPromoActive } from "@/lib/utils"
import { ProductCard } from "@/components/store/product-card"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { ProductGallery } from "@/components/store/product-gallery"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { take: 1 } },
  })
  if (!product) return { title: "Produto não encontrado" }
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || "",
    openGraph: {
      images: product.ogImage || product.images[0]?.url ? [{ url: product.ogImage || product.images[0]?.url }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, active: true },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      subcategory: true,
      variants: { where: { active: true } },
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!product) notFound()

  const hasPromo = isPromoActive(
    product.promoPrice ? Number(product.promoPrice) : null,
    product.promoStart,
    product.promoEnd
  )
  const currentPrice = hasPromo ? Number(product.promoPrice) : Number(product.price)
  const discount = hasPromo ? calculateDiscount(Number(product.price), Number(product.promoPrice)) : 0

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true } },
    },
    take: 4,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-tobacco-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-tobacco-700 transition-colors">Início</Link>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <Link href={`/categoria/${product.category.slug}`} className="hover:text-tobacco-700 transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-tobacco-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <div>
          {product.brand && (
            <p className="text-sm text-tobacco-500 mb-1">{product.brand}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-tobacco-900 mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= avgRating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-tobacco-500">
                ({product.reviews.length} avaliação{product.reviews.length !== 1 && "ões"})
              </span>
            </div>
          )}

          <p className="text-sm text-tobacco-500 mb-4">SKU: {product.sku}</p>

          {/* Price */}
          <div className="mb-6">
            {hasPromo && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-tobacco-400 line-through text-lg">
                  {formatPrice(Number(product.price))}
                </span>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
              </div>
            )}
            <span className="text-3xl font-bold text-tobacco-700">
              {formatPrice(currentPrice)}
            </span>
            <p className="text-sm text-tobacco-500 mt-1">
              até 12x de {formatPrice(currentPrice / 12)} sem juros
            </p>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-tobacco-600 mb-6">{product.shortDescription}</p>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-tobacco-700 mb-2">Variações:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="px-3 py-1.5 border border-tobacco-200 rounded-lg text-sm hover:border-tobacco-600 hover:text-tobacco-700 transition-colors"
                  >
                    {variant.name}: {variant.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              promoPrice: hasPromo ? Number(product.promoPrice) : undefined,
              image: product.images[0]?.url || "/images/placeholder.jpg",
              stock: product.stock,
            }}
          />

          {/* Tobacco Warning */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Este produto contém nicotina e causa dependência. A venda é proibida para menores de 18 anos.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="bg-white rounded-xl border border-tobacco-200 p-6 mb-12 shadow-sm">
        <div className="border-b border-tobacco-200 mb-6">
          <div className="flex gap-8">
            <button className="pb-3 border-b-2 border-tobacco-700 text-tobacco-700 font-medium text-sm">
              Descrição
            </button>
          </div>
        </div>
        {product.description ? (
          <div className="text-tobacco-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        ) : (
          <p className="text-tobacco-400">Sem descrição disponível.</p>
        )}
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-tobacco-200 p-6 mb-12 shadow-sm">
          <h2 className="text-xl font-bold text-tobacco-900 mb-6">
            Avaliações ({product.reviews.length})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.user.name}</span>
                </div>
                {review.title && <p className="font-medium text-sm">{review.title}</p>}
                {review.comment && <p className="text-sm text-tobacco-600 mt-1">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-tobacco-900 mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  price: Number(p.price),
                  promoPrice: p.promoPrice ? Number(p.promoPrice) : null,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
