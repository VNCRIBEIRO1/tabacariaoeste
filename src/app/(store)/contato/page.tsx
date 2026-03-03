"use client"

import { useState } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const contactInfo = [
  {
    icon: Phone,
    label: "Telefone / WhatsApp",
    value: "(18) 98817-6442",
    href: "https://wa.me/5518988176442",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@oestetabacaria.com.br",
    href: "mailto:contato@oestetabacaria.com.br",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP, 19010-270",
    href: "https://maps.google.com/?q=Av.+Manoel+Goulart,+32+-+Centro,+Presidente+Prudente+-+SP",
  },
  {
    icon: Clock,
    label: "Horário de Funcionamento",
    value: "Seg a Sex: 9h - 19h | Sáb: 9h - 14h",
  },
]

export default function ContatoPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSent(true)
    setLoading(false)
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
          Fale Conosco
        </h1>
        <p className="text-stone-600">
          Tem alguma dúvida, sugestão ou precisa de ajuda? Entre em contato
          conosco. Ficaremos felizes em atender você!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map((info) => {
            const Icon = info.icon
            return (
              <Card key={info.label}>
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-700 hover:text-amber-800"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-stone-500">{info.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/5518988176442?text=Olá! Vim pelo site da Oeste Tabacaria."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Falar via WhatsApp
          </a>
        </div>

        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Envie uma Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-stone-500 mb-4">
                  Recebemos sua mensagem e retornaremos em breve.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">
                      Nome
                    </label>
                    <Input
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">
                    Assunto
                  </label>
                  <Input
                    placeholder="Sobre o que deseja falar?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">
                    Mensagem
                  </label>
                  <textarea
                    placeholder="Escreva sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={loading}
                    rows={5}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Enviar Mensagem
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-700" />
            Nossa Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.7!2d-51.389!3d-22.121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDA3JzE1LjYiUyA1McKwMjMnMjAuNCJX!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Oeste Tabacaria"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
