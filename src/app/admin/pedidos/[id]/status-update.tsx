"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ORDER_STATUS_LABELS } from "@/lib/utils"
import { Loader2, Save } from "lucide-react"

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

const statuses = [
  "AWAITING_PAYMENT",
  "PAID",
  "SEPARATING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
]

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: OrderStatusUpdateProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [note, setNote] = useState("")
  const [trackingCode, setTrackingCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus && !note) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note: note || undefined,
          trackingCode: trackingCode || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao atualizar status")
      }

      setNote("")
      setTrackingCode("")
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 print:hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-1">
            Novo Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {status === "SHIPPED" && (
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Código de Rastreio
            </label>
            <Input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Código de rastreio"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-1">
          Observação (opcional)
        </label>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota sobre a alteração de status..."
        />
      </div>

      <Button
        onClick={handleUpdate}
        disabled={loading || (status === currentStatus && !note)}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Atualizando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Atualizar Status
          </>
        )}
      </Button>
    </div>
  )
}
