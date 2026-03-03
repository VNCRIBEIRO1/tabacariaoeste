"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    promoPrice?: number
    image: string
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  const handleAdd = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      promoPrice: product.promoPrice,
      maxStock: product.stock,
      quantity,
    })
  }

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full" size="lg">
        Produto Esgotado
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Quantidade:</span>
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-2 hover:bg-gray-100"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-gray-500">({product.stock} disponíveis)</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleAdd} className="flex-1" size="lg">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
        <Button
          onClick={() => {
            handleAdd()
            window.location.href = "/checkout"
          }}
          variant="outline"
          size="lg"
          className="border-amber-700 text-amber-700 hover:bg-amber-50"
        >
          <Zap className="h-5 w-5 mr-2" />
          Comprar Agora
        </Button>
      </div>
    </div>
  )
}
