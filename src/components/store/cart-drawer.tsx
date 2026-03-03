"use client"

import { useEffect, useState } from "react"
import { X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/utils"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const subtotal = getSubtotal()
  const freeShippingThreshold = 299
  const remaining = Math.max(0, freeShippingThreshold - subtotal)
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-tobacco-100">
            <h2 className="text-lg font-bold text-tobacco-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-tobacco-600" />
              Carrinho
              {items.length > 0 && (
                <span className="text-xs bg-tobacco-100 text-tobacco-600 px-2 py-0.5 rounded-full font-semibold">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </span>
              )}
            </h2>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-tobacco-50 transition-colors"
            >
              <X className="h-5 w-5 text-tobacco-600" />
            </button>
          </div>

          {/* Free shipping progress */}
          {items.length > 0 && (
            <div className="px-4 py-3 bg-tobacco-50 border-b border-tobacco-100">
              {remaining > 0 ? (
                <>
                  <p className="text-xs text-tobacco-600 mb-1.5">
                    Falta <span className="font-bold text-tobacco-700">{formatPrice(remaining)}</span> para{" "}
                    <span className="font-bold text-green-600">FRETE GRÁTIS</span>
                  </p>
                  <div className="w-full bg-tobacco-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-tobacco-500 to-tobacco-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs font-semibold text-green-600 flex items-center gap-1.5">
                  🎉 Parabéns! Você ganhou FRETE GRÁTIS!
                </p>
              )}
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-tobacco-50 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-10 w-10 text-tobacco-300" />
                </div>
                <p className="text-tobacco-700 font-medium mb-1">
                  Seu carrinho está vazio
                </p>
                <p className="text-tobacco-400 text-sm mb-6">
                  Adicione produtos para continuar
                </p>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-tobacco-600 text-white rounded-full text-sm font-semibold hover:bg-tobacco-700 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-tobacco-50 rounded-xl border border-tobacco-100 hover:border-tobacco-200 transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-tobacco-100">
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
                        className="text-sm font-semibold text-tobacco-800 line-clamp-2 hover:text-tobacco-600 transition-colors"
                        onClick={closeCart}
                      >
                        {item.name}
                      </Link>
                      {item.variantInfo && (
                        <p className="text-[11px] text-tobacco-400 mt-0.5">
                          {item.variantInfo}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-tobacco-200 rounded-full overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-tobacco-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3 text-tobacco-600" />
                          </button>
                          <span className="text-sm font-semibold w-7 text-center text-tobacco-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-tobacco-50 transition-colors"
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3 text-tobacco-600" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-tobacco-700">
                          {formatPrice((item.promoPrice || item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="self-start p-1.5 text-tobacco-300 hover:text-red-500 transition-colors"
                      aria-label="Remover item"
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
            <div className="border-t border-tobacco-100 p-4 bg-tobacco-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-tobacco-600">Subtotal</span>
                <span className="text-xl font-bold text-tobacco-800">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-tobacco-400">
                Frete e cupons calculados na finalização
              </p>
              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block">
                  <button className="w-full flex items-center justify-center gap-2 bg-tobacco-700 text-white py-3 rounded-full font-semibold hover:bg-tobacco-800 transition-colors shadow-sm">
                    Finalizar Compra
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/carrinho" onClick={closeCart} className="block">
                  <button className="w-full py-2.5 rounded-full text-sm font-medium text-tobacco-600 border border-tobacco-200 hover:bg-tobacco-50 transition-colors">
                    Ver Carrinho Completo
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
