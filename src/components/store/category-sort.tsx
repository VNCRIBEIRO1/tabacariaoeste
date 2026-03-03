"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface CategorySortProps {
  defaultSort: string
  slug: string
}

export function CategorySort({ defaultSort, slug }: CategorySortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.delete("page")
    router.push(`/categoria/${slug}?${params.toString()}`)
  }

  return (
    <select
      className="w-full text-sm border border-tobacco-200 rounded-lg p-2.5 bg-white text-tobacco-800 focus:outline-none focus:ring-2 focus:ring-tobacco-500/30"
      defaultValue={defaultSort}
      onChange={(e) => handleSort(e.target.value)}
    >
      <option value="newest">Mais Recentes</option>
      <option value="price-asc">Menor Preço</option>
      <option value="price-desc">Maior Preço</option>
      <option value="bestsellers">Mais Vendidos</option>
    </select>
  )
}
