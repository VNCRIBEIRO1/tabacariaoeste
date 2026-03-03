"use client"

import { useState, useEffect } from "react"
import { Cookie } from "lucide-react"

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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-tobacco-100 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-tobacco-100 flex items-center justify-center flex-shrink-0">
            <Cookie className="h-5 w-5 text-tobacco-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-tobacco-700">
              Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{" "}
              <a href="/politica-de-privacidade" className="text-tobacco-600 underline font-medium hover:text-tobacco-800">
                Política de Privacidade
              </a>.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-full text-sm font-medium text-tobacco-500 border border-tobacco-200 hover:bg-tobacco-50 transition-colors"
            >
              Recusar
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-tobacco-700 text-white hover:bg-tobacco-800 transition-colors"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
