"use client"

import { useEffect, useState } from "react"
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/stores/cart-store"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const subtotal = getSubtotal()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrinho ({items.length})
            </h2>
            <button onClick={closeCart} className="hover:bg-gray-100 rounded-full p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <Button onClick={closeCart} variant="outline">
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-white">
                      <Image
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produto/${item.slug}`}
                        className="text-sm font-medium text-stone-800 line-clamp-1 hover:text-amber-700"
                        onClick={closeCart}
                      >
                        {item.name}
                      </Link>
                      {item.variantInfo && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variantInfo}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-amber-700">
                          {formatPrice((item.promoPrice || item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span className="text-amber-700">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Frete calculado na finalização
              </p>
              <div className="space-y-2">
                <Link href="/carrinho" onClick={closeCart}>
                  <Button variant="outline" className="w-full">
                    Ver Carrinho
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full mt-2">Finalizar Compra</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
