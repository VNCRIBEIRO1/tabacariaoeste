"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, CreditCard, QrCode, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/utils"
import { useEffect } from "react"

export default function CheckoutPage() {
  const { items, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    paymentMethod: "PIX" as string,
  })

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const subtotal = getSubtotal()
  const shipping = 0
  const total = subtotal + shipping

  const handleCepLookup = async () => {
    const cep = formData.cep.replace(/\D/g, "")
    if (cep.length !== 8) return

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }))
      }
    } catch {}
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantId: item.variantId,
          })),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = `/conta/pedidos/${data.orderNumber}`
      }
    } catch {
      alert("Erro ao processar pedido")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">Início</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/carrinho" className="hover:text-amber-700">Carrinho</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-stone-900 font-medium">Checkout</span>
      </nav>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? "bg-amber-700 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {s}
            </div>
            <span className={`text-sm hidden md:block ${step >= s ? "text-stone-900" : "text-gray-500"}`}>
              {s === 1 ? "Dados Pessoais" : s === 2 ? "Endereço" : "Pagamento"}
            </span>
            {s < 3 && <div className="w-12 h-px bg-gray-300 hidden md:block" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Personal Data */}
          {step === 1 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nome Completo</label>
                  <Input value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">CPF</label>
                  <Input value={formData.cpf} onChange={(e) => updateField("cpf", e.target.value)} placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
                  <Input value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)}>Próximo</Button>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">CEP</label>
                  <Input value={formData.cep} onChange={(e) => updateField("cep", e.target.value)} onBlur={handleCepLookup} placeholder="00000-000" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Rua</label>
                  <Input value={formData.street} onChange={(e) => updateField("street", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Número</label>
                  <Input value={formData.number} onChange={(e) => updateField("number", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Complemento</label>
                  <Input value={formData.complement} onChange={(e) => updateField("complement", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bairro</label>
                  <Input value={formData.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cidade</label>
                  <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Estado</label>
                  <Input value={formData.state} onChange={(e) => updateField("state", e.target.value)} />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={() => setStep(3)}>Próximo</Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>
              <div className="space-y-3">
                {[
                  { value: "PIX", label: "Pix", icon: QrCode, desc: "Aprovação instantânea" },
                  { value: "CREDIT_CARD", label: "Cartão de Crédito", icon: CreditCard, desc: "Até 12x sem juros" },
                  { value: "BOLETO", label: "Boleto Bancário", icon: FileText, desc: "Vencimento em 3 dias" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.paymentMethod === method.value ? "border-amber-700 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => updateField("paymentMethod", e.target.value)}
                      className="sr-only"
                    />
                    <method.icon className={`h-6 w-6 ${formData.paymentMethod === method.value ? "text-amber-700" : "text-gray-400"}`} />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                <Button onClick={handleSubmit} disabled={loading} size="lg">
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-lg border p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Resumo</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate max-w-[70%]">{item.name} x{item.quantity}</span>
                <span>{formatPrice((item.promoPrice || item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frete</span>
              <span>{shipping > 0 ? formatPrice(shipping) : "Grátis"}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-amber-700">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
