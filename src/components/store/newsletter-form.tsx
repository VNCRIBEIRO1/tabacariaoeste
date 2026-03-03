"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, CheckCircle } from "lucide-react"

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
        setMessage("Cadastrado com sucesso!")
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
      <div className="flex items-center justify-center gap-2 text-green-400">
        <CheckCircle className="h-5 w-5" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-stone-800 border-stone-700 text-white placeholder:text-gray-500"
        required
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="flex-shrink-0"
      >
        <Send className="h-4 w-4 mr-2" />
        {status === "loading" ? "..." : "Cadastrar"}
      </Button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2">{message}</p>
      )}
    </form>
  )
}
