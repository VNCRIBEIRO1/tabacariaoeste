"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function AgeVerification() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem("age-verified")
    if (!verified) {
      setShow(true)
    }
  }, [])

  const handleConfirm = () => {
    localStorage.setItem("age-verified", "true")
    setShow(false)
  }

  const handleDeny = () => {
    window.location.href = "https://www.google.com"
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 rounded-full p-4">
            <AlertTriangle className="h-12 w-12 text-amber-700" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Verificação de Idade
        </h2>
        <p className="text-gray-600 mb-2">
          Este site contém produtos derivados do tabaco destinados exclusivamente a maiores de 18 anos.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Ao acessar, você confirma ter 18 anos ou mais e estar ciente dos riscos associados ao consumo de tabaco.
        </p>

        <div className="space-y-3">
          <Button onClick={handleConfirm} className="w-full" size="lg">
            Sim, tenho 18 anos ou mais
          </Button>
          <Button
            onClick={handleDeny}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Não, sou menor de 18 anos
          </Button>
        </div>

        <p className="text-[10px] text-gray-400 mt-4">
          A venda de produtos derivados do tabaco é proibida para menores de 18 anos — Lei 8.069/1990 (ECA).
          Este produto contém nicotina e causa dependência.
        </p>
      </div>
    </div>
  )
}
