"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Loader2,
  BarChart3,
  Calendar,
} from "lucide-react"

interface ReportData {
  revenue: number
  ordersCount: number
  averageTicket: number
  newCustomers: number
  topCategories: { name: string; total: number; count: number }[]
  topProducts: { name: string; total: number; quantity: number }[]
}

export default function AdminRelatoriosPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ReportData | null>(null)

  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [startDate, setStartDate] = useState(
    thirtyDaysAgo.toISOString().slice(0, 10)
  )
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10))

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/reports?startDate=${startDate}&endDate=${endDate}`
      )
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch {
      alert("Erro ao carregar relatórios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Relatórios</h1>
          <p className="text-sm text-gray-500">
            Visão geral do desempenho da loja
          </p>
        </div>
      </div>

      {/* Seletor de período */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Início
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Fim
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={fetchData} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
        </div>
      ) : data ? (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Receita</p>
                    <p className="text-2xl font-bold text-stone-900">
                      {formatPrice(data.revenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-50">
                    <ShoppingBag className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pedidos</p>
                    <p className="text-2xl font-bold text-stone-900">
                      {data.ordersCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ticket Médio</p>
                    <p className="text-2xl font-bold text-stone-900">
                      {formatPrice(data.averageTicket)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Novos Clientes</p>
                    <p className="text-2xl font-bold text-stone-900">
                      {data.newCustomers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categorias */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topCategories.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nenhum dado no período selecionado
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.topCategories.map((cat, index) => {
                      const maxTotal = data.topCategories[0]?.total || 1
                      const percentage = (cat.total / maxTotal) * 100
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-stone-900">
                              {cat.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatPrice(cat.total)} ({cat.count} pedidos)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-amber-700 rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Produtos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topProducts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nenhum dado no período selecionado
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.topProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-stone-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.quantity} unidade{product.quantity !== 1 ? "s" : ""} vendida{product.quantity !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-stone-900">
                          {formatPrice(product.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">
              Selecione um período e clique em &quot;Gerar Relatório&quot;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
