"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "lucide-react"

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShow(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <Cookie className="h-8 w-8 text-amber-700 flex-shrink-0 hidden md:block" />
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            Utilizamos cookies para melhorar sua experiência de navegação, personalizar conteúdo
            e analisar nosso tráfego. Ao continuar, você concorda com nossa{" "}
            <a href="/politica-de-privacidade" className="text-amber-700 underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Recusar
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  )
}
