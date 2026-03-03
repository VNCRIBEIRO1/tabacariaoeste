"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "5518988176442"
  const message = encodeURIComponent("Olá! Gostaria de mais informações sobre os produtos da Oeste Tabacaria.")

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all hover:scale-110"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
