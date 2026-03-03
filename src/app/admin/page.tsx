import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils"
import Link from "next/link"

async function getDashboardData() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    todaySales,
    monthSales,
    pendingOrders,
    lowStockProducts,
    totalCustomers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: "AWAITING_PAYMENT" } }),
    prisma.product.count({
      where: { active: true, trackStock: true, stock: { lte: prisma.product.fields.minStock } },
    }).catch(() => 0),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { salesCount: "desc" },
      take: 5,
      select: { id: true, name: true, salesCount: true, price: true },
    }),
  ])

  return {
    todaySales,
    monthSales,
    pendingOrders,
    lowStockProducts,
    totalCustomers,
    recentOrders,
    topProducts,
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const cards = [
    {
      title: "Vendas Hoje",
      value: formatPrice(Number(data.todaySales._sum.total || 0)),
      subtitle: `${data.todaySales._count} pedido(s)`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Vendas do Mês",
      value: formatPrice(Number(data.monthSales._sum.total || 0)),
      subtitle: `${data.monthSales._count} pedido(s)`,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pedidos Pendentes",
      value: data.pendingOrders.toString(),
      subtitle: "Aguardando pagamento",
      icon: ShoppingBag,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Clientes",
      value: data.totalCustomers.toString(),
      subtitle: "Total cadastrados",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.bg} rounded-full p-3`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum pedido ainda.</p>
            ) : (
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.user.name || order.user.email} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatPrice(Number(order.total))}</p>
                      <Badge className={`text-[10px] ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum produto vendido ainda.</p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, idx) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400 w-6">#{idx + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.salesCount} vendas</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(Number(product.price))}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {data.lowStockProducts > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              {data.lowStockProducts} produto(s) com estoque baixo
            </p>
            <Link href="/admin/produtos?filter=low-stock" className="text-xs text-yellow-700 hover:underline">
              Ver produtos →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
