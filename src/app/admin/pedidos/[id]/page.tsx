import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Printer, Package, MapPin, CreditCard, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import OrderStatusUpdate from "./status-update"

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true, cpf: true } },
      items: {
        include: {
          product: {
            select: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      history: { orderBy: { createdAt: "desc" } },
      coupon: { select: { code: true, type: true, value: true } },
    },
  })

  if (!order) notFound()

  const shippingAddress = order.shippingAddress as any

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/admin/pedidos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Pedido {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== "undefined") window.print()
            }}
            className="print:hidden"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status atual e atualização */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Status do Pedido</CardTitle>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                    ORDER_STATUS_COLORS[order.status] || ""
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>

          {/* Itens do pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900">{item.productName}</p>
                      {item.variantInfo && (
                        <p className="text-xs text-gray-500">{item.variantInfo}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Qtd: {item.quantity} × {formatPrice(Number(item.unitPrice))}
                      </p>
                    </div>
                    <p className="font-semibold text-stone-900">
                      {formatPrice(Number(item.totalPrice))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="mt-6 border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span>{formatPrice(Number(order.shippingCost))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>-{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                {order.couponCode && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Cupom: {order.couponCode}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-amber-700">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.history.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum histórico disponível</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-4">
                    {order.history.map((entry, index) => (
                      <div key={entry.id} className="flex items-start gap-4 relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            index === 0
                              ? "bg-amber-700 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-medium text-sm text-stone-900">
                            {ORDER_STATUS_LABELS[entry.status] || entry.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(entry.createdAt)}
                          </p>
                          {entry.note && (
                            <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-stone-900">{order.user.name || "—"}</p>
              <p className="text-sm text-gray-500">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-sm text-gray-500">{order.user.phone}</p>
              )}
              {order.user.cpf && (
                <p className="text-sm text-gray-500">CPF: {order.user.cpf}</p>
              )}
            </CardContent>
          </Card>

          {/* Endereço de entrega */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-stone-900">
                  {shippingAddress.recipientName}
                </p>
                <p>
                  {shippingAddress.street}, {shippingAddress.number}
                  {shippingAddress.complement && ` - ${shippingAddress.complement}`}
                </p>
                <p>
                  {shippingAddress.neighborhood} - {shippingAddress.city}/
                  {shippingAddress.state}
                </p>
                <p>CEP: {shippingAddress.cep}</p>
              </CardContent>
            </Card>
          )}

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Método: </span>
                <span className="font-medium">{order.paymentMethod || "—"}</span>
              </p>
              {order.paymentId && (
                <p className="text-sm">
                  <span className="text-gray-500">ID: </span>
                  <span className="font-mono text-xs">{order.paymentId}</span>
                </p>
              )}
              {order.trackingCode && (
                <p className="text-sm">
                  <span className="text-gray-500">Rastreio: </span>
                  <span className="font-mono font-bold text-amber-700">
                    {order.trackingCode}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
