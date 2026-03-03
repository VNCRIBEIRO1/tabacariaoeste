import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  Package,
  ChevronRight,
} from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, formatDate } from "@/lib/utils"

export const metadata = {
  title: "Minha Conta | Oeste Tabacaria",
}

export default async function ContaPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const [recentOrders, wishlistCount, addressCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        items: { take: 1, include: { product: { include: { images: { take: 1 } } } } },
      },
    }),
    prisma.wishlist.count({ where: { userId: session.user.id } }),
    prisma.address.count({ where: { userId: session.user.id } }),
  ])

  const statusLabels: Record<string, string> = {
    AWAITING_PAYMENT: "Aguardando Pagamento",
    PAID: "Pago",
    SEPARATING: "Separando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  }

  const quickLinks = [
    { href: "/conta/pedidos", label: "Meus Pedidos", icon: ShoppingBag, count: recentOrders.length },
    { href: "/conta/enderecos", label: "Endereços", icon: MapPin, count: addressCount },
    { href: "/conta/favoritos", label: "Favoritos", icon: Heart, count: wishlistCount },
    { href: "/conta/dados", label: "Dados Pessoais", icon: Settings },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-stone-900">
            Olá, {session.user.name || "Cliente"}! 👋
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Bem-vindo(a) de volta à Oeste Tabacaria. Gerencie seus pedidos, endereços e dados pessoais.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href}>
              <Card className="hover:border-amber-200 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <p className="text-sm font-medium text-stone-900">{link.label}</p>
                  {link.count !== undefined && (
                    <p className="text-xs text-stone-400 mt-1">
                      {link.count} {link.count === 1 ? "item" : "itens"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Pedidos Recentes</CardTitle>
          <Link
            href="/conta/pedidos"
            className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
          >
            Ver todos <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/conta/pedidos/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        Pedido #{order.orderNumber || order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-stone-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-900">
                      {formatPrice(Number(order.total))}
                    </p>
                    <p className="text-xs text-amber-700 font-medium">
                      {statusLabels[order.status] || order.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm text-stone-500">Você ainda não fez nenhum pedido.</p>
              <Link
                href="/"
                className="text-sm text-amber-700 hover:text-amber-800 font-medium mt-2 inline-block"
              >
                Começar a comprar
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
