"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ChevronRight, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [couponCode, setCouponCode] = useState("")

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const subtotal = getSubtotal()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-20 w-20 text-tobacco-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-tobacco-900 mb-2">Carrinho Vazio</h1>
        <p className="text-tobacco-500 mb-6">Você ainda não adicionou nenhum produto.</p>
        <Link href="/">
          <Button>Continuar Comprando</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-tobacco-500 mb-6">
        <Link href="/" className="hover:text-tobacco-700">Início</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-tobacco-900 font-medium">Carrinho</span>
      </nav>

      <h1 className="text-2xl font-bold text-tobacco-900 mb-8">Meu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-tobacco-200 p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-tobacco-100 flex-shrink-0">
                <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/produto/${item.slug}`} className="font-medium text-tobacco-800 hover:text-tobacco-600 line-clamp-1">
                  {item.name}
                </Link>
                {item.variantInfo && <p className="text-xs text-gray-500 mt-0.5">{item.variantInfo}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-tobacco-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-tobacco-50" disabled={item.quantity <= 1}>
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm w-10 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-tobacco-50" disabled={item.quantity >= item.maxStock}>
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-tobacco-700">
                    {formatPrice((item.promoPrice || item.price) * item.quantity)}
                  </span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-600 hover:underline">
            Limpar Carrinho
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-tobacco-200 p-6 h-fit sticky top-24 shadow-sm">
          <h2 className="text-lg font-semibold text-tobacco-900 mb-4">Resumo do Pedido</h2>

          {/* Coupon */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button variant="outline" size="sm">Aplicar</Button>
          </div>

          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-tobacco-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tobacco-600">Frete</span>
              <span className="text-tobacco-500">Calcular no checkout</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-tobacco-200 pt-2 mt-2">
              <span>Total</span>
              <span className="text-tobacco-700">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Link href="/checkout" className="block mt-4">
            <Button className="w-full" size="lg">Finalizar Compra</Button>
          </Link>
          <Link href="/" className="block mt-2">
            <Button variant="ghost" className="w-full text-sm">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
