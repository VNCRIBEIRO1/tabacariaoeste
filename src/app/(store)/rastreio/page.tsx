"use client"

import { useState } from "react"
import { Package, Search, Loader2, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrackingEvent {
  date: string
  time: string
  location: string
  status: string
}

interface TrackingResult {
  code: string
  status: string
  events: TrackingEvent[]
}

export default function RastreioPage() {
  const [trackingCode, setTrackingCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setResult(null)

    if (!trackingCode.trim()) {
      setError("Por favor, informe o código de rastreio.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `/api/tracking?code=${encodeURIComponent(trackingCode.trim())}`
      )

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Não foi possível rastrear o pedido.")
        return
      }

      const data = await response.json()
      setResult(data)
    } catch {
      setError("Erro ao consultar rastreio. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes("entregue")) return CheckCircle
    if (status.toLowerCase().includes("trânsito") || status.toLowerCase().includes("transito"))
      return Truck
    return Clock
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-amber-700" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Rastrear Pedido
          </h1>
          <p className="text-stone-500">
            Insira o código de rastreio para acompanhar seu pedido
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Digite o código de rastreio (ex: BR1234567890XX)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  disabled={loading}
                  className="uppercase"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Rastrear</span>
              </Button>
            </form>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Rastreio: {result.code}
                </CardTitle>
                <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  {result.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {result.events.map((event, index) => {
                  const StatusIcon = getStatusIcon(event.status)
                  const isFirst = index === 0
                  const isLast = index === result.events.length - 1

                  return (
                    <div key={index} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                            isFirst
                              ? "bg-amber-700 text-white"
                              : "bg-stone-100 text-stone-400"
                          }`}
                        >
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-full min-h-[40px] bg-stone-200" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-6">
                        <p
                          className={`text-sm font-medium ${
                            isFirst ? "text-stone-900" : "text-stone-600"
                          }`}
                        >
                          {event.status}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-stone-400">
                            {event.date} às {event.time}
                          </span>
                          {event.location && (
                            <span className="text-xs text-stone-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help */}
        {!result && !error && (
          <div className="text-center text-sm text-stone-400 space-y-2">
            <p>
              O código de rastreio é enviado por e-mail após o envio do seu
              pedido.
            </p>
            <p>
              Você também pode encontrá-lo na seção{" "}
              <a href="/conta/pedidos" className="text-amber-700 hover:underline">
                Meus Pedidos
              </a>
              .
            </p>
            <p>
              Dúvidas? Fale conosco via{" "}
              <a
                href="https://wa.me/5518988176442"
                className="text-amber-700 hover:underline"
              >
                WhatsApp (18) 98817-6442
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
