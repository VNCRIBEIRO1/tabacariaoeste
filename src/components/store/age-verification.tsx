"use client"

import { useState, useEffect } from "react"
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
    <div className="fixed inset-0 bg-tobacco-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-amber-700" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-tobacco-900 mb-2">
          Verificação de Idade
        </h2>
        <p className="text-tobacco-600 mb-2">
          Este site contém produtos derivados do tabaco destinados exclusivamente a maiores de 18 anos.
        </p>
        <p className="text-sm text-tobacco-400 mb-8">
          Ao acessar, você confirma ter 18 anos ou mais e estar ciente dos riscos associados ao consumo de tabaco.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-full bg-tobacco-700 text-white font-semibold hover:bg-tobacco-800 transition-colors shadow-sm"
          >
            Sim, tenho 18 anos ou mais
          </button>
          <button
            onClick={handleDeny}
            className="w-full py-3 rounded-full border-2 border-tobacco-200 text-tobacco-600 font-semibold hover:bg-tobacco-50 transition-colors"
          >
            Não, sou menor de 18 anos
          </button>
        </div>

        <p className="text-[10px] text-tobacco-400 mt-6 leading-relaxed">
          A venda de produtos derivados do tabaco é proibida para menores de 18 anos — Lei 8.069/1990 (ECA).
          Este produto contém nicotina e causa dependência.
        </p>
      </div>
    </div>
  )
}
