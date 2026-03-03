"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, ImagePlus, X } from "lucide-react"

interface BannerFormProps {
  bannerId?: string | null
  onClose?: () => void
}

export default function BannerForm({ bannerId, onClose }: BannerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!bannerId)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    link: "",
    position: "HERO",
    desktopImage: "",
    mobileImage: "",
    startDate: "",
    endDate: "",
    order: "0",
    active: true,
  })

  useEffect(() => {
    if (bannerId) {
      const fetchBanner = async () => {
        try {
          const res = await fetch(`/api/admin/banners/${bannerId}`)
          if (res.ok) {
            const banner = await res.json()
            setForm({
              title: banner.title || "",
              subtitle: banner.subtitle || "",
              link: banner.link || "",
              position: banner.position || "HERO",
              desktopImage: banner.desktopImage || "",
              mobileImage: banner.mobileImage || "",
              startDate: banner.startDate
                ? new Date(banner.startDate).toISOString().slice(0, 16)
                : "",
              endDate: banner.endDate
                ? new Date(banner.endDate).toISOString().slice(0, 16)
                : "",
              order: banner.order?.toString() || "0",
              active: banner.active ?? true,
            })
          }
        } catch {
          // silently fail
        } finally {
          setFetching(false)
        }
      }
      fetchBanner()
    }
  }, [bannerId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "desktopImage" | "mobileImage"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setForm((prev) => ({ ...prev, [field]: data.url }))
      }
    } catch {
      alert("Erro ao fazer upload da imagem")
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = "Título é obrigatório"
    if (!form.desktopImage.trim())
      newErrors.desktopImage = "Imagem desktop é obrigatória"
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
        order: parseInt(form.order),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      }

      const url = bannerId
        ? `/api/admin/banners/${bannerId}`
        : "/api/admin/banners"
      const method = bannerId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao salvar banner")
      }

      router.refresh()
      if (onClose) onClose()
    } catch (err: any) {
      alert(err.message || "Erro ao salvar banner")
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
            {bannerId ? "Editar Banner" : "Novo Banner"}
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
                Título *
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Título do banner"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Subtítulo
              </label>
              <Input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Subtítulo (opcional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Link
              </label>
              <Input
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Posição
              </label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="HERO">Hero (Principal)</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="SIDEBAR">Lateral</option>
              </select>
            </div>
          </div>

          {/* Imagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Imagem Desktop *
              </label>
              {form.desktopImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={form.desktopImage}
                    alt="Desktop"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, desktopImage: "" }))
                    }
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-700 hover:bg-amber-50 transition-colors">
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload Desktop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "desktopImage")}
                    className="hidden"
                  />
                </label>
              )}
              {errors.desktopImage && (
                <p className="text-xs text-red-600 mt-1">{errors.desktopImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Imagem Mobile
              </label>
              {form.mobileImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={form.mobileImage}
                    alt="Mobile"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, mobileImage: "" }))
                    }
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-700 hover:bg-amber-50 transition-colors">
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload Mobile</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "mobileImage")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Ordem
              </label>
              <Input
                name="order"
                type="number"
                value={form.order}
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
            <span className="text-sm text-stone-900">Banner ativo</span>
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
                  {bannerId ? "Salvar Alterações" : "Criar Banner"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
