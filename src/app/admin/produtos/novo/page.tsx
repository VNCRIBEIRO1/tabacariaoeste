"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { slugify } from "@/lib/utils"
import { ArrowLeft, Save, Upload, Plus, Trash2, Loader2, ImagePlus } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface Variant {
  name: string
  value: string
  price: string
  stock: string
}

interface ImageFile {
  url: string
  file?: File
  isPrimary: boolean
}

export default function NovoProdutoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ImageFile[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    sku: "",
    price: "",
    promoPrice: "",
    promoStart: "",
    promoEnd: "",
    categoryId: "",
    stock: "0",
    minStock: "0",
    trackStock: true,
    weight: "",
    height: "",
    width: "",
    length: "",
    active: true,
    featured: false,
    tags: "",
  })

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

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
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (data.url) {
          setImages((prev) => [
            ...prev,
            { url: data.url, isPrimary: prev.length === 0 },
          ])
        }
      } catch {
        alert("Erro ao fazer upload da imagem")
      }
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true
      }
      return updated
    })
  }

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    )
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: "", value: "", price: "", stock: "0" }])
  }

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!form.slug.trim()) newErrors.slug = "Slug é obrigatório"
    if (!form.sku.trim()) newErrors.sku = "SKU é obrigatório"
    if (!form.price || parseFloat(form.price) <= 0)
      newErrors.price = "Preço é obrigatório"

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
        price: parseFloat(form.price),
        promoPrice: form.promoPrice ? parseFloat(form.promoPrice) : null,
        stock: parseInt(form.stock),
        minStock: parseInt(form.minStock),
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
        width: form.width ? parseFloat(form.width) : null,
        length: form.length ? parseFloat(form.length) : null,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        images: images.map((img, i) => ({
          url: img.url,
          isPrimary: img.isPrimary,
          order: i,
        })),
        variants: variants
          .filter((v) => v.name && v.value)
          .map((v) => ({
            name: v.name,
            value: v.value,
            price: v.price ? parseFloat(v.price) : null,
            stock: parseInt(v.stock) || 0,
          })),
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao criar produto")
      }

      router.push("/admin/produtos")
    } catch (err: any) {
      alert(err.message || "Erro ao criar produto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/produtos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Novo Produto</h1>
          <p className="text-sm text-gray-500">Preencha os dados do produto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Nome *
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nome do produto"
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
                  placeholder="slug-do-produto"
                />
                {errors.slug && (
                  <p className="text-xs text-red-600 mt-1">{errors.slug}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  SKU *
                </label>
                <Input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="SKU-001"
                />
                {errors.sku && (
                  <p className="text-xs text-red-600 mt-1">{errors.sku}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Categoria
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Descrição Curta
              </label>
              <Input
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Breve descrição do produto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Descrição Completa
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Descrição detalhada do produto..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Tags (separadas por vírgula)
              </label>
              <Input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="tabaco, premium, importado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preço */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Preço (R$) *
                </label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0,00"
                />
                {errors.price && (
                  <p className="text-xs text-red-600 mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Preço Promocional (R$)
                </label>
                <Input
                  name="promoPrice"
                  type="number"
                  step="0.01"
                  value={form.promoPrice}
                  onChange={handleChange}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Início da Promoção
                </label>
                <Input
                  name="promoStart"
                  type="datetime-local"
                  value={form.promoStart}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Fim da Promoção
                </label>
                <Input
                  name="promoEnd"
                  type="datetime-local"
                  value={form.promoEnd}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estoque */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Estoque
                </label>
                <Input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Estoque Mínimo
                </label>
                <Input
                  name="minStock"
                  type="number"
                  value={form.minStock}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="trackStock"
                    checked={form.trackStock}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                  />
                  <span className="text-sm text-stone-900">Controlar estoque</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensões */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dimensões e Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Peso (kg)
                </label>
                <Input
                  name="weight"
                  type="number"
                  step="0.001"
                  value={form.weight}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Altura (cm)
                </label>
                <Input
                  name="height"
                  type="number"
                  step="0.01"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Largura (cm)
                </label>
                <Input
                  name="width"
                  type="number"
                  step="0.01"
                  value={form.width}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Comprimento (cm)
                </label>
                <Input
                  name="length"
                  type="number"
                  step="0.01"
                  value={form.length}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imagens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg border-2 overflow-hidden ${
                    img.isPrimary
                      ? "border-amber-700"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-1 right-1 flex gap-1">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="bg-white rounded-full p-1 shadow text-xs text-amber-700 hover:bg-amber-50"
                        title="Definir como principal"
                      >
                        ★
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-white rounded-full p-1 shadow text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {img.isPrimary && (
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-700 text-white text-[10px] text-center py-0.5">
                      Principal
                    </div>
                  )}
                </div>
              ))}

              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-700 hover:bg-amber-50 transition-colors">
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Adicionar</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Variantes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Variantes</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Variante
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {variants.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma variante adicionada
              </p>
            ) : (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      placeholder="Nome (ex: Cor)"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Valor (ex: Vermelho)"
                      value={variant.value}
                      onChange={(e) =>
                        updateVariant(index, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Preço"
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, "price", e.target.value)
                      }
                      className="w-28"
                    />
                    <Input
                      placeholder="Estoque"
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, "stock", e.target.value)
                      }
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opções */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-900">Produto ativo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-900">Produto destaque</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/produtos">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
