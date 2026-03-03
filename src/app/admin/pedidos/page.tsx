import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, ShoppingBag, Search } from "lucide-react"

interface SearchParams {
  status?: string
  search?: string
  page?: string
}

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const statusFilter = searchParams.status || ""
  const search = searchParams.search || ""
  const page = parseInt(searchParams.page || "1")
  const perPage = 20

  const where: any = {}

  if (statusFilter) {
    where.status = statusFilter
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  const statuses = [
    "AWAITING_PAYMENT",
    "PAID",
    "SEPARATING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Pedidos</h1>
          <p className="text-sm text-gray-500">
            {total} pedido{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <form method="GET" className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Buscar por número, nome ou email..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todos os status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Pedido</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Data</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Pagamento</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      Nenhum pedido encontrado
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono font-bold text-amber-700">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-stone-900">
                          {order.user.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4 font-medium text-stone-900">
                        {formatPrice(Number(order.total))}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            ORDER_STATUS_COLORS[order.status] || ""
                          }`}
                        >
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {order.paymentMethod || "—"}
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/pedidos/${order.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/pedidos?page=${page - 1}&status=${statusFilter}&search=${search}`}
            >
              <Button variant="outline" size="sm">
                Anterior
              </Button>
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`/admin/pedidos?page=${p}&status=${statusFilter}&search=${search}`}
              >
                <Button
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                >
                  {p}
                </Button>
              </Link>
            )
          )}
          {page < totalPages && (
            <Link
              href={`/admin/pedidos?page=${page + 1}&status=${statusFilter}&search=${search}`}
            >
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
