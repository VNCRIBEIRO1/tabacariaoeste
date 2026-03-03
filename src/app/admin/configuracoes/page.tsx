"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Save,
  Loader2,
  Settings,
  Truck,
  CreditCard,
  Mail,
  Globe,
  ImagePlus,
  X,
  Plus,
  Trash2,
} from "lucide-react"

type Tab = "geral" | "envio" | "pagamento" | "email" | "seo"

interface ShippingZone {
  id?: string
  name: string
  states: string
  price: string
  minDays: string
  maxDays: string
  active: boolean
}

export default function AdminConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("geral")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([])

  const [geral, setGeral] = useState({
    storeName: "",
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    logo: "",
  })

  const [envio, setEnvio] = useState({
    freeShippingMin: "",
    fixedShipping: "",
    enablePickup: false,
  })

  const [pagamento, setPagamento] = useState({
    mpAccessToken: "",
    mpPublicKey: "",
    maxInstallments: "12",
    enablePix: true,
    enableCard: true,
    enableBoleto: true,
  })

  const [email, setEmail] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    emailFrom: "",
  })

  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    gaId: "",
    fbPixelId: "",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, zonesRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/shipping-zones"),
        ])

        if (settingsRes.ok) {
          const s = await settingsRes.json()
          setGeral({
            storeName: s.storeName || "",
            phone: s.phone || "",
            email: s.email || "",
            address: s.address || "",
            whatsapp: s.whatsapp || "",
            instagram: s.instagram || "",
            facebook: s.facebook || "",
            youtube: s.youtube || "",
            logo: s.logo || "",
          })
          setEnvio({
            freeShippingMin: s.freeShippingMin?.toString() || "",
            fixedShipping: s.fixedShipping?.toString() || "",
            enablePickup: s.enablePickup ?? false,
          })
          setPagamento({
            mpAccessToken: s.mpAccessToken || "",
            mpPublicKey: s.mpPublicKey || "",
            maxInstallments: s.maxInstallments?.toString() || "12",
            enablePix: s.enablePix ?? true,
            enableCard: s.enableCard ?? true,
            enableBoleto: s.enableBoleto ?? true,
          })
          setEmail({
            smtpHost: s.smtpHost || "",
            smtpPort: s.smtpPort?.toString() || "",
            smtpUser: s.smtpUser || "",
            smtpPass: s.smtpPass || "",
            emailFrom: s.emailFrom || "",
          })
          setSeo({
            metaTitle: s.metaTitle || "",
            metaDescription: s.metaDescription || "",
            gaId: s.gaId || "",
            fbPixelId: s.fbPixelId || "",
          })
        }

        if (zonesRes.ok) {
          const zones = await zonesRes.json()
          setShippingZones(
            zones.map((z: any) => ({
              id: z.id,
              name: z.name,
              states: z.states?.join(", ") || "",
              price: z.price?.toString() || "",
              minDays: z.minDays?.toString() || "3",
              maxDays: z.maxDays?.toString() || "10",
              active: z.active ?? true,
            }))
          )
        }
      } catch {
        // silently fail
      } finally {
        setFetching(false)
      }
    }

    fetchSettings()
  }, [])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setGeral((prev) => ({ ...prev, logo: data.url }))
      }
    } catch {
      alert("Erro ao fazer upload do logo")
    }
  }

  const saveSettings = async (section: Tab) => {
    setLoading(true)
    try {
      let payload: any = {}

      switch (section) {
        case "geral":
          payload = geral
          break
        case "envio":
          payload = {
            freeShippingMin: envio.freeShippingMin
              ? parseFloat(envio.freeShippingMin)
              : null,
            fixedShipping: envio.fixedShipping
              ? parseFloat(envio.fixedShipping)
              : null,
            enablePickup: envio.enablePickup,
            shippingZones: shippingZones.map((z) => ({
              id: z.id,
              name: z.name,
              states: z.states.split(",").map((s) => s.trim()).filter(Boolean),
              price: parseFloat(z.price) || 0,
              minDays: parseInt(z.minDays) || 3,
              maxDays: parseInt(z.maxDays) || 10,
              active: z.active,
            })),
          }
          break
        case "pagamento":
          payload = {
            ...pagamento,
            maxInstallments: parseInt(pagamento.maxInstallments),
          }
          break
        case "email":
          payload = {
            ...email,
            smtpPort: email.smtpPort ? parseInt(email.smtpPort) : null,
          }
          break
        case "seo":
          payload = seo
          break
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, ...payload }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao salvar configurações")
      }

      alert("Configurações salvas com sucesso!")
    } catch (err: any) {
      alert(err.message || "Erro ao salvar configurações")
    } finally {
      setLoading(false)
    }
  }

  const addShippingZone = () => {
    setShippingZones((prev) => [
      ...prev,
      { name: "", states: "", price: "", minDays: "3", maxDays: "10", active: true },
    ])
  }

  const updateShippingZone = (
    index: number,
    field: keyof ShippingZone,
    value: string | boolean
  ) => {
    setShippingZones((prev) =>
      prev.map((z, i) => (i === index ? { ...z, [field]: value } : z))
    )
  }

  const removeShippingZone = (index: number) => {
    setShippingZones((prev) => prev.filter((_, i) => i !== index))
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "geral", label: "Geral", icon: <Settings className="h-4 w-4" /> },
    { key: "envio", label: "Envio", icon: <Truck className="h-4 w-4" /> },
    { key: "pagamento", label: "Pagamento", icon: <CreditCard className="h-4 w-4" /> },
    { key: "email", label: "E-mail", icon: <Mail className="h-4 w-4" /> },
    { key: "seo", label: "SEO", icon: <Globe className="h-4 w-4" /> },
  ]

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Configurações</h1>
        <p className="text-sm text-gray-500">Gerencie as configurações da loja</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-amber-700 text-amber-700"
                : "border-transparent text-gray-500 hover:text-stone-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Geral */}
      {activeTab === "geral" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Nome da Loja
                </label>
                <Input
                  value={geral.storeName}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, storeName: e.target.value }))
                  }
                  placeholder="Oeste Tabacaria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Telefone
                </label>
                <Input
                  value={geral.phone}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="(00) 0000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={geral.email}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="contato@oestetabacaria.com.br"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  WhatsApp
                </label>
                <Input
                  value={geral.whatsapp}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, whatsapp: e.target.value }))
                  }
                  placeholder="5500000000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Endereço
              </label>
              <Input
                value={geral.address}
                onChange={(e) =>
                  setGeral((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Endereço completo da loja"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Instagram
                </label>
                <Input
                  value={geral.instagram}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, instagram: e.target.value }))
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Facebook
                </label>
                <Input
                  value={geral.facebook}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, facebook: e.target.value }))
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  YouTube
                </label>
                <Input
                  value={geral.youtube}
                  onChange={(e) =>
                    setGeral((prev) => ({ ...prev, youtube: e.target.value }))
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Logo
              </label>
              <div className="flex items-center gap-4">
                {geral.logo ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={geral.logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setGeral((prev) => ({ ...prev, logo: "" }))
                      }
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-700 hover:bg-amber-50 transition-colors">
                    <ImagePlus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => saveSettings("geral")} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Geral
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Envio */}
      {activeTab === "envio" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Envio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-900 mb-1">
                    Frete Grátis a partir de (R$)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={envio.freeShippingMin}
                    onChange={(e) =>
                      setEnvio((prev) => ({
                        ...prev,
                        freeShippingMin: e.target.value,
                      }))
                    }
                    placeholder="Valor mínimo para frete grátis"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-900 mb-1">
                    Frete Fixo (R$)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={envio.fixedShipping}
                    onChange={(e) =>
                      setEnvio((prev) => ({
                        ...prev,
                        fixedShipping: e.target.value,
                      }))
                    }
                    placeholder="Valor do frete fixo"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={envio.enablePickup}
                  onChange={(e) =>
                    setEnvio((prev) => ({
                      ...prev,
                      enablePickup: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-900">
                  Habilitar retirada na loja
                </span>
              </label>
            </CardContent>
          </Card>

          {/* Zonas de envio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Zonas de Envio</CardTitle>
                <Button variant="outline" size="sm" onClick={addShippingZone}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Zona
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {shippingZones.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma zona de envio configurada
                </p>
              ) : (
                <div className="space-y-4">
                  {shippingZones.map((zone, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-900">
                          Zona {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeShippingZone(index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Nome da zona"
                          value={zone.name}
                          onChange={(e) =>
                            updateShippingZone(index, "name", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Estados (SP, RJ, MG)"
                          value={zone.states}
                          onChange={(e) =>
                            updateShippingZone(index, "states", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Preço (R$)"
                          type="number"
                          step="0.01"
                          value={zone.price}
                          onChange={(e) =>
                            updateShippingZone(index, "price", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Dias mín."
                          type="number"
                          value={zone.minDays}
                          onChange={(e) =>
                            updateShippingZone(index, "minDays", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Dias máx."
                          type="number"
                          value={zone.maxDays}
                          onChange={(e) =>
                            updateShippingZone(index, "maxDays", e.target.value)
                          }
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={zone.active}
                            onChange={(e) =>
                              updateShippingZone(
                                index,
                                "active",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                          />
                          <span className="text-sm">Ativa</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => saveSettings("envio")} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Envio
            </Button>
          </div>
        </div>
      )}

      {/* Tab: Pagamento */}
      {activeTab === "pagamento" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-amber-800">
                🔒 MercadoPago - Credenciais de Produção
              </p>
              <p className="text-xs text-amber-600 mt-1">
                As credenciais ficam armazenadas de forma segura no banco de dados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Access Token
                </label>
                <Input
                  type="password"
                  value={pagamento.mpAccessToken}
                  onChange={(e) =>
                    setPagamento((prev) => ({
                      ...prev,
                      mpAccessToken: e.target.value,
                    }))
                  }
                  placeholder="APP_USR-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Public Key
                </label>
                <Input
                  type="password"
                  value={pagamento.mpPublicKey}
                  onChange={(e) =>
                    setPagamento((prev) => ({
                      ...prev,
                      mpPublicKey: e.target.value,
                    }))
                  }
                  placeholder="APP_USR-..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Parcelas Máximas
              </label>
              <Input
                type="number"
                value={pagamento.maxInstallments}
                onChange={(e) =>
                  setPagamento((prev) => ({
                    ...prev,
                    maxInstallments: e.target.value,
                  }))
                }
                className="w-32"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pagamento.enablePix}
                  onChange={(e) =>
                    setPagamento((prev) => ({
                      ...prev,
                      enablePix: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-900">PIX</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pagamento.enableCard}
                  onChange={(e) =>
                    setPagamento((prev) => ({
                      ...prev,
                      enableCard: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-900">Cartão de Crédito</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pagamento.enableBoleto}
                  onChange={(e) =>
                    setPagamento((prev) => ({
                      ...prev,
                      enableBoleto: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-900">Boleto</span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => saveSettings("pagamento")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: E-mail */}
      {activeTab === "email" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações de E-mail (SMTP)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Host SMTP
                </label>
                <Input
                  value={email.smtpHost}
                  onChange={(e) =>
                    setEmail((prev) => ({ ...prev, smtpHost: e.target.value }))
                  }
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Porta SMTP
                </label>
                <Input
                  type="number"
                  value={email.smtpPort}
                  onChange={(e) =>
                    setEmail((prev) => ({ ...prev, smtpPort: e.target.value }))
                  }
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Usuário SMTP
                </label>
                <Input
                  value={email.smtpUser}
                  onChange={(e) =>
                    setEmail((prev) => ({ ...prev, smtpUser: e.target.value }))
                  }
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Senha SMTP
                </label>
                <Input
                  type="password"
                  value={email.smtpPass}
                  onChange={(e) =>
                    setEmail((prev) => ({ ...prev, smtpPass: e.target.value }))
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                E-mail Remetente
              </label>
              <Input
                value={email.emailFrom}
                onChange={(e) =>
                  setEmail((prev) => ({ ...prev, emailFrom: e.target.value }))
                }
                placeholder="noreply@oestetabacaria.com.br"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => saveSettings("email")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar E-mail
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: SEO */}
      {activeTab === "seo" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO e Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Meta Título
              </label>
              <Input
                value={seo.metaTitle}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                placeholder="Oeste Tabacaria - Produtos Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Meta Descrição
              </label>
              <textarea
                value={seo.metaDescription}
                onChange={(e) =>
                  setSeo((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Descrição da loja para mecanismos de busca..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {seo.metaDescription.length}/160 caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Google Analytics ID
                </label>
                <Input
                  value={seo.gaId}
                  onChange={(e) =>
                    setSeo((prev) => ({ ...prev, gaId: e.target.value }))
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Facebook Pixel ID
                </label>
                <Input
                  value={seo.fbPixelId}
                  onChange={(e) =>
                    setSeo((prev) => ({ ...prev, fbPixelId: e.target.value }))
                  }
                  placeholder="000000000000000"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => saveSettings("seo")} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar SEO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
