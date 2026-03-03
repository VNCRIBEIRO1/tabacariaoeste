"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, calculateDiscount, isPromoActive } from "@/lib/utils"
import { useCartStore } from "@/stores/cart-store"

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
  }

  return (
    <Link href={`/produto/${product.slug}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:border-amber-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasPromo && (
              <Badge variant="destructive" className="text-[10px]">
                -{discount}%
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-emerald-600 text-[10px]">
                Novo
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white rounded-full p-1.5 shadow hover:bg-amber-50 transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            <button className="bg-white rounded-full p-1.5 shadow hover:bg-amber-50 transition-colors">
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Add to Cart - Quick */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleAddToCart}
                className="w-full bg-amber-700 text-white py-2 text-sm font-medium hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Adicionar
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {product.category && (
            <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
          )}
          <h3 className="text-sm font-medium text-stone-800 line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-amber-700">
              {formatPrice(currentPrice)}
            </span>
            {hasPromo && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <p className="text-xs text-red-600 mt-1 font-medium">Esgotado</p>
          )}
        </div>
      </div>
    </Link>
  )
}
