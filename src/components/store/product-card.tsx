"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { formatPrice, calculateDiscount, isPromoActive } from "@/lib/utils"
import { useCartStore } from "@/stores/cart-store"
import { toast } from "sonner"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    promoPrice?: number | null
    promoStart?: Date | null
    promoEnd?: Date | null
    images: { url: string; alt?: string | null }[]
    category?: { name: string } | null
    stock: number
    createdAt: Date
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const image = product.images[0]?.url || "/images/placeholder.jpg"
  const imageAlt = product.images[0]?.alt || product.name

  const hasPromo = isPromoActive(
    product.promoPrice as number,
    product.promoStart as Date,
    product.promoEnd as Date
  )
  const currentPrice = hasPromo ? product.promoPrice! : product.price
  const discount = hasPromo ? calculateDiscount(product.price, product.promoPrice!) : 0

  const isNew =
    new Date().getTime() - new Date(product.createdAt).getTime() <
    30 * 24 * 60 * 60 * 1000

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock <= 0) return
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: product.price,
      promoPrice: hasPromo ? product.promoPrice! : undefined,
      maxStock: product.stock,
    })
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-tobacco-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-tobacco-200/30 hover:border-tobacco-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-tobacco-50">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {hasPromo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                NOVO
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                Últimas {product.stock} un.
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-tobacco-600 hover:text-white transition-all duration-200"
              aria-label="Favoritar"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-tobacco-600 hover:text-white transition-all duration-200"
              aria-label="Visualização rápida"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart overlay */}
          {product.stock > 0 ? (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-tobacco-700/95 backdrop-blur-sm text-white py-3 text-sm font-semibold hover:bg-tobacco-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Adicionar ao Carrinho
              </button>
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="w-full bg-tobacco-900/80 backdrop-blur-sm text-white py-2.5 text-xs font-semibold text-center uppercase tracking-wider">
                Esgotado
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          {product.category && (
            <p className="text-[11px] font-medium text-tobacco-400 uppercase tracking-wider mb-1.5">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-tobacco-900 line-clamp-2 mb-2 min-h-[2.5rem] leading-snug group-hover:text-tobacco-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-tobacco-700">
              {formatPrice(currentPrice)}
            </span>
            {hasPromo && (
              <span className="text-xs text-tobacco-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {currentPrice >= 50 && (
            <p className="text-[11px] text-tobacco-400 mt-1">
              ou 12x de {formatPrice(currentPrice / 12)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
