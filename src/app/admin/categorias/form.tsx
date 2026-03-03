"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { slugify } from "@/lib/utils"
import { Save, Loader2, ImagePlus, X } from "lucide-react"

interface CategoryFormProps {
  categoryId?: string | null
  onClose?: () => void
}

interface Category {
  id: string
  name: string
}

export default function CategoryForm({ categoryId, onClose }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!categoryId)
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    parentId: "",
    order: "0",
    active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsRes = await fetch("/api/admin/categories")
        const cats = await catsRes.json()
        setCategories(cats.filter((c: Category) => c.id !== categoryId))

        if (categoryId) {
          const res = await fetch(`/api/admin/categories/${categoryId}`)
          if (res.ok) {
            const category = await res.json()
            setForm({
              name: category.name || "",
              slug: category.slug || "",
              description: category.description || "",
              image: category.image || "",
              parentId: category.parentId || "",
              order: category.order?.toString() || "0",
              active: category.active ?? true,
            })
          }
        }
      } catch {
        // silently fail
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [categoryId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }
      if (name === "name") {
        updated.slug = slugify(value)
      }
      return updated
    })
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setForm((prev) => ({ ...prev, image: data.url }))
      }
    } catch {
      alert("Erro ao fazer upload da imagem")
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!form.slug.trim()) newErrors.slug = "Slug é obrigatório"
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
        parentId: form.parentId || null,
      }

      const url = categoryId
        ? `/api/admin/categories/${categoryId}`
        : "/api/admin/categories"
      const method = categoryId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao salvar categoria")
      }

      router.refresh()
      if (onClose) onClose()
    } catch (err: any) {
      alert(err.message || "Erro ao salvar categoria")
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
            {categoryId ? "Editar Categoria" : "Nova Categoria"}
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
                Nome *
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome da categoria"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Slug *
              </label>
              <Input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="slug-da-categoria"
              />
              {errors.slug && (
                <p className="text-xs text-red-600 mt-1">{errors.slug}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descrição da categoria..."
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Categoria Pai
              </label>
              <select
                name="parentId"
                value={form.parentId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Nenhuma (raiz)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Imagem
            </label>
            <div className="flex items-center gap-4">
              {form.image ? (
                <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={form.image}
                    alt="Categoria"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-amber-700 hover:bg-amber-50 transition-colors">
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
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
            <span className="text-sm text-stone-900">Categoria ativa</span>
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
                  {categoryId ? "Salvar Alterações" : "Criar Categoria"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
