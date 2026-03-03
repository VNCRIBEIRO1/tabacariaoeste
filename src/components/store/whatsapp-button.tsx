"use client"

import { useState } from "react"
import { MessageCircle, X, Send, ShoppingBag, HelpCircle, Package } from "lucide-react"

const PHONE = "5518988176442"

interface ChatOption {
  icon: React.ReactNode
  label: string
  description: string
  message: string
}

const options: ChatOption[] = [
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Compra em Atacado",
    description: "Preços especiais para revenda",
    message:
      "Olá! Tenho interesse em comprar em atacado/revenda na Oeste Tabacaria. Gostaria de saber mais sobre condições e preços especiais.",
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Meu Pedido",
    description: "Dúvidas sobre entrega ou pedido",
    message:
      "Olá! Gostaria de informações sobre meu pedido na Oeste Tabacaria. Meu número de pedido é: ",
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Dúvidas Gerais",
    description: "Produtos, disponibilidade, etc.",
    message:
      "Olá! Gostaria de mais informações sobre os produtos da Oeste Tabacaria.",
  },
]

export function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  const sendMessage = (message: string) => {
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${PHONE}?text=${encoded}`, "_blank")
    setOpen(false)
  }

  return (
    <>
      {/* Chat popup */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 md:bg-transparent"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-tobacco-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Oeste Tabacaria</p>
                      <p className="text-xs text-green-100">Online agora</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Greeting */}
              <div className="p-4 border-b border-tobacco-100">
                <div className="bg-tobacco-50 rounded-xl p-3">
                  <p className="text-sm text-tobacco-700">
                    👋 Olá! Como posso ajudar? Escolha uma das opções abaixo:
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="p-3 space-y-2">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(opt.message)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-tobacco-50 hover:bg-green-50 border border-transparent hover:border-green-200 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      {opt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tobacco-800">
                        {opt.label}
                      </p>
                      <p className="text-xs text-tobacco-500">{opt.description}</p>
                    </div>
                    <Send className="h-4 w-4 text-tobacco-300 group-hover:text-green-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 bg-tobacco-50 border-t border-tobacco-100">
                <p className="text-[10px] text-tobacco-400 text-center">
                  Horário de atendimento: Seg-Sáb, 9h às 19h
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-4 md:right-6 z-50 rounded-full p-4 shadow-lg transition-all duration-300 ${
          open
            ? "bg-tobacco-700 hover:bg-tobacco-800 rotate-90"
            : "bg-green-500 hover:bg-green-600 hover:scale-110"
        }`}
        aria-label="Contato via WhatsApp"
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
          </>
        )}
      </button>
    </>
  )
}
