"use client"

import { useState } from "react"
import { Send, CheckCircle, Loader2 } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus("success")
        setMessage("Cadastrado com sucesso! 🎉")
        setEmail("")
      } else {
        const data = await res.json()
        setStatus("error")
        setMessage(data.error || "Erro ao cadastrar")
      }
    } catch {
      setStatus("error")
      setMessage("Erro ao cadastrar")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 text-green-400 animate-fade-in">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full bg-tobacco-800 border border-tobacco-700 text-white px-5 py-3 text-sm placeholder:text-tobacco-400 focus:outline-none focus:ring-2 focus:ring-tobacco-500/50 focus:border-tobacco-500 transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-tobacco-500 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-tobacco-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === "loading" ? "Enviando..." : "Cadastrar"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-3 text-center">{message}</p>
      )}
    </form>
  )
}
