import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  User,
  ShoppingBag,
  MapPin,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function AdminClienteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          paymentMethod: true,
        },
      },
      addresses: {
        orderBy: { isDefault: "desc" },
      },
    },
  })

  if (!customer) notFound()

  const totalSpent = customer.orders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  )
  const averageTicket =
    customer.orders.length > 0 ? totalSpent / customer.orders.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {customer.name || "Cliente"}
          </h1>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <ShoppingBag className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {customer.orders.length}
              </p>
              <p className="text-xs text-gray-500">Pedidos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {formatPrice(totalSpent)}
              </p>
              <p className="text-xs text-gray-500">Total Gasto</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {formatPrice(averageTicket)}
              </p>
              <p className="text-xs text-gray-500">Ticket Médio</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">
                {formatDate(customer.createdAt)}
              </p>
              <p className="text-xs text-gray-500">Cadastro</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Nome</p>
              <p className="text-sm font-medium text-stone-900">
                {customer.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-stone-900">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm font-medium text-stone-900">
                {customer.phone || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">CPF</p>
              <p className="text-sm font-medium text-stone-900">
                {customer.cpf || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              {customer.blocked ? (
                <Badge variant="destructive">Bloqueado</Badge>
              ) : (
                <Badge variant="success">Ativo</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Endereços */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços ({customer.addresses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum endereço cadastrado</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 rounded-lg border ${
                      address.isDefault
                        ? "border-amber-700 bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    {address.isDefault && (
                      <Badge variant="default" className="mb-2">
                        Padrão
                      </Badge>
                    )}
                    {address.label && (
                      <p className="font-medium text-stone-900 text-sm">
                        {address.label}
                      </p>
                    )}
                    <p className="text-sm text-stone-900">
                      {address.recipientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.neighborhood} - {address.city}/{address.state}
                    </p>
                    <p className="text-sm text-gray-600">CEP: {address.cep}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Histórico de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Pedido
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Data
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Pagamento
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Nenhum pedido realizado
                    </td>
                  </tr>
                ) : (
                  customer.orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono font-bold text-amber-700">
                          {order.orderNumber}
                        </span>
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
                          <Button variant="ghost" size="sm">
                            Ver Pedido
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
    </div>
  )
}
