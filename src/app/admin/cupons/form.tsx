"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, X } from "lucide-react"

interface CouponFormProps {
  couponId?: string | null
  onClose?: () => void
}

export default function CouponForm({ couponId, onClose }: CouponFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!couponId)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minOrder: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    active: true,
  })

  useEffect(() => {
    if (couponId) {
      const fetchCoupon = async () => {
        try {
          const res = await fetch(`/api/admin/coupons/${couponId}`)
          if (res.ok) {
            const coupon = await res.json()
            setForm({
              code: coupon.code || "",
              type: coupon.type || "PERCENTAGE",
              value: coupon.value?.toString() || "",
              minOrder: coupon.minOrder?.toString() || "",
              maxUses: coupon.maxUses?.toString() || "",
              startDate: coupon.startDate
                ? new Date(coupon.startDate).toISOString().slice(0, 16)
                : "",
              endDate: coupon.endDate
                ? new Date(coupon.endDate).toISOString().slice(0, 16)
                : "",
              active: coupon.active ?? true,
            })
          }
        } catch {
          // silently fail
        } finally {
          setFetching(false)
        }
      }
      fetchCoupon()
    }
  }, [couponId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "code" ? value.toUpperCase() : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.code.trim()) newErrors.code = "Código é obrigatório"
    if (!form.value || parseFloat(form.value) <= 0)
      newErrors.value = "Valor é obrigatório"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value),
        minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      }

      const url = couponId
        ? `/api/admin/coupons/${couponId}`
        : "/api/admin/coupons"
      const method = couponId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao salvar cupom")
      }

      router.refresh()
      if (onClose) onClose()
    } catch (err: any) {
      alert(err.message || "Erro ao salvar cupom")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {couponId ? "Editar Cupom" : "Novo Cupom"}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Código *
              </label>
              <Input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="DESCONTO10"
                className="uppercase"
              />
              {errors.code && (
                <p className="text-xs text-red-600 mt-1">{errors.code}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Tipo de Desconto
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="PERCENTAGE">Percentual (%)</option>
                <option value="FIXED">Valor Fixo (R$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Valor * {form.type === "PERCENTAGE" ? "(%)" : "(R$)"}
              </label>
              <Input
                name="value"
                type="number"
                step="0.01"
                value={form.value}
                onChange={handleChange}
                placeholder="0,00"
              />
              {errors.value && (
                <p className="text-xs text-red-600 mt-1">{errors.value}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Pedido Mínimo (R$)
              </label>
              <Input
                name="minOrder"
                type="number"
                step="0.01"
                value={form.minOrder}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Usos Máximos
            </label>
            <Input
              name="maxUses"
              type="number"
              value={form.maxUses}
              onChange={handleChange}
              placeholder="Ilimitado"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Data Início
              </label>
              <Input
                name="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Data Fim
              </label>
              <Input
                name="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
            />
            <span className="text-sm text-stone-900">Cupom ativo</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {couponId ? "Salvar Alterações" : "Criar Cupom"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
