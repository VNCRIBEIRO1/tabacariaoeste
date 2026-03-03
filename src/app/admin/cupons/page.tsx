import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function deleteCoupon(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role)) return

  const id = formData.get("id") as string
  await prisma.coupon.delete({ where: { id } })
  revalidatePath("/admin/cupons")
}

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "Percentual",
  FIXED: "Fixo",
}

export default async function AdminCuponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Cupons</h1>
          <p className="text-sm text-gray-500">
            {coupons.length} cupom{coupons.length !== 1 ? "ns" : ""} cadastrado{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/cupons?modal=new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cupom
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Código</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Pedido Mín.</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Usos Máx.</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Usado</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Validade</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      <Tag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      Nenhum cupom encontrado
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const now = new Date()
                    const isValid =
                      coupon.active &&
                      (!coupon.startDate || new Date(coupon.startDate) <= now) &&
                      (!coupon.endDate || new Date(coupon.endDate) >= now) &&
                      (!coupon.maxUses || coupon.usedCount < coupon.maxUses)

                    return (
                      <tr key={coupon.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-mono font-bold text-amber-700">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {TYPE_LABELS[coupon.type] || coupon.type}
                        </td>
                        <td className="p-4 font-medium text-stone-900">
                          {coupon.type === "PERCENTAGE"
                            ? `${Number(coupon.value)}%`
                            : formatPrice(Number(coupon.value))}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {coupon.minOrder
                            ? formatPrice(Number(coupon.minOrder))
                            : "—"}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {coupon.maxUses ?? "Ilimitado"}
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{coupon.usedCount}</Badge>
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {coupon.startDate && (
                            <p>De: {formatDate(coupon.startDate)}</p>
                          )}
                          {coupon.endDate && (
                            <p>Até: {formatDate(coupon.endDate)}</p>
                          )}
                          {!coupon.startDate && !coupon.endDate && "—"}
                        </td>
                        <td className="p-4">
                          {isValid ? (
                            <Badge variant="success">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/cupons?modal=edit&id=${coupon.id}`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <form action={deleteCoupon}>
                              <input type="hidden" name="id" value={coupon.id} />
                              <Button
                                variant="ghost"
                                size="icon"
                                type="submit"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e: any) => {
                                  if (
                                    !confirm(
                                      "Tem certeza que deseja excluir este cupom?"
                                    )
                                  ) {
                                    e.preventDefault()
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
