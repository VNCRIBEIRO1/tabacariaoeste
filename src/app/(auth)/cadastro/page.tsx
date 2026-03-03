"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CadastroPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao criar conta.")
        return
      }

      router.push("/login?registered=true")
    } catch {
      setError("Ocorreu um erro ao criar a conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-stone-900">Criar Conta</CardTitle>
        <CardDescription>
          Crie sua conta e aproveite as vantagens
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-stone-700">
              Nome completo
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-stone-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-stone-700">
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
              Confirmar senha
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
            />
            <label htmlFor="terms" className="text-xs text-stone-500">
              Li e aceito os{" "}
              <Link href="/termos-de-uso" className="text-amber-700 hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/politica-de-privacidade" className="text-amber-700 hover:underline">
                Política de Privacidade
              </Link>
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Criar conta
          </Button>

          <p className="text-sm text-stone-500 text-center">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-amber-700 font-medium hover:text-amber-800">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
