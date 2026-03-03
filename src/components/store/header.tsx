"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Phone,
  MapPin,
  Instagram,
  Truck,
  Shield,
  CreditCard,
} from "lucide-react"
import { useCartStore } from "@/stores/cart-store"

const categories = [
  { name: "Charutos", slug: "charutos", icon: "🪵" },
  { name: "Cigarrilhas", slug: "cigarrilhas", icon: "🚬" },
  { name: "Tabaco p/ Cachimbo", slug: "tabaco-cachimbo", icon: "🫧" },
  { name: "Acessórios", slug: "acessorios", icon: "✂️" },
  { name: "Isqueiros", slug: "isqueiros", icon: "🔥" },
  { name: "Head Shop", slug: "head-shop", icon: "🌿" },
  { name: "Bebidas", slug: "bebidas", icon: "🥃" },
  { name: "Presentes", slug: "presentes", icon: "🎁" },
]

const promos = [
  "Frete grátis acima de R$ 299",
  "Use BEMVINDO10 e ganhe 10% OFF",
  "Parcele em até 12x sem juros",
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [promoIndex, setPromoIndex] = useState(0)
  const { getItemCount, openCart } = useCartStore()
  const itemCount = getItemCount()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setPromoIndex((i) => (i + 1) % promos.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        {/* Promo Bar */}
        <div className="bg-tobacco-900 text-tobacco-100 text-xs py-1.5 overflow-hidden">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-tobacco-200">
                <Phone className="h-3 w-3 text-tobacco-400" />
                (18) 98817-6442
              </span>
              <span className="flex items-center gap-1.5 text-tobacco-200">
                <MapPin className="h-3 w-3 text-tobacco-400" />
                Pres. Prudente - SP
              </span>
            </div>
            <div className="flex-1 md:flex-none text-center">
              <p className="font-medium text-amber-300 animate-fade-in" key={promoIndex}>
                {promos[promoIndex]}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://instagram.com/oestetabacaria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tobacco-300 hover:text-amber-400 transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div
          className={`bg-white border-b border-tobacco-100 transition-all duration-300 ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-1.5 rounded-md hover:bg-tobacco-50 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-tobacco-800" />
                ) : (
                  <Menu className="h-6 w-6 text-tobacco-800" />
                )}
              </button>

              {/* Logo */}
              <Link href="/" className="flex-shrink-0 group">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-tobacco-600 to-tobacco-800 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    OT
                  </div>
                  <div className="leading-tight">
                    <h1 className="text-lg md:text-xl font-bold tracking-tight">
                      <span className="text-tobacco-600 group-hover:text-tobacco-700 transition-colors">
                        OESTE
                      </span>{" "}
                      <span className="text-tobacco-900">TABACARIA</span>
                    </h1>
                    <p className="text-[10px] text-tobacco-400 font-medium tracking-widest hidden sm:block">
                      CHARUTOS &amp; ACESSÓRIOS PREMIUM
                    </p>
                  </div>
                </div>
              </Link>

              {/* Search — Desktop */}
              <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Buscar charutos, acessórios, bebidas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-tobacco-200 bg-tobacco-50/50 px-5 py-2.5 pr-12 text-sm text-tobacco-800 placeholder:text-tobacco-400 focus:outline-none focus:ring-2 focus:ring-tobacco-500/30 focus:border-tobacco-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-tobacco-600 text-white hover:bg-tobacco-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Actions */}
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  className="lg:hidden p-2 rounded-full hover:bg-tobacco-50 transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5 text-tobacco-700" />
                </button>

                <Link
                  href="/conta"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-tobacco-700 hover:bg-tobacco-50 hover:text-tobacco-900 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline font-medium">Conta</span>
                </Link>

                <Link
                  href="/conta/wishlist"
                  className="hidden md:flex p-2 rounded-full hover:bg-tobacco-50 transition-colors relative"
                  aria-label="Lista de desejos"
                >
                  <Heart className="h-5 w-5 text-tobacco-700" />
                </Link>

                <button
                  onClick={openCart}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-tobacco-50 transition-colors group"
                  aria-label="Carrinho"
                >
                  <ShoppingCart className="h-5 w-5 text-tobacco-700 group-hover:text-tobacco-900" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 rounded-full bg-tobacco-600 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-sm">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Search Expanded */}
            {searchOpen && (
              <form onSubmit={handleSearch} className="lg:hidden mt-3 animate-fade-in">
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="O que você procura?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-tobacco-200 bg-tobacco-50/50 px-5 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-tobacco-500/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-tobacco-600 text-white"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Navigation — Desktop */}
        <nav className="hidden lg:block bg-tobacco-800 text-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2.5 text-sm font-medium hover:bg-tobacco-700 transition-colors"
                >
                  Início
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium hover:bg-tobacco-700 transition-colors"
                  >
                    <span className="text-xs">{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contato"
                  className="block px-4 py-2.5 text-sm font-medium hover:bg-tobacco-700 transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Benefits strip */}
        <div className="hidden md:block bg-tobacco-50 border-b border-tobacco-100">
          <div className="container mx-auto px-4 py-1.5">
            <div className="flex items-center justify-center gap-8 text-xs text-tobacco-600">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-tobacco-500" />
                Frete grátis acima de R$ 299
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-tobacco-500" />
                Até 12x sem juros
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-tobacco-500" />
                Compra 100% segura
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto animate-slide-in">
            <div className="p-4 border-b border-tobacco-100 flex items-center justify-between">
              <span className="font-bold text-tobacco-800">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded hover:bg-tobacco-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4">
              <Link
                href="/"
                className="block py-3 px-3 rounded-lg text-tobacco-800 font-medium hover:bg-tobacco-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>

              <p className="text-xs font-semibold text-tobacco-400 uppercase tracking-wider mt-4 mb-2 px-3">
                Categorias
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="flex items-center gap-3 py-3 px-3 rounded-lg text-tobacco-700 hover:bg-tobacco-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}

              <div className="border-t border-tobacco-100 mt-4 pt-4">
                <Link
                  href="/conta"
                  className="flex items-center gap-3 py-3 px-3 rounded-lg text-tobacco-700 hover:bg-tobacco-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Minha Conta</span>
                </Link>
                <Link
                  href="/conta/wishlist"
                  className="flex items-center gap-3 py-3 px-3 rounded-lg text-tobacco-700 hover:bg-tobacco-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>Lista de Desejos</span>
                </Link>
                <Link
                  href="/contato"
                  className="flex items-center gap-3 py-3 px-3 rounded-lg text-tobacco-700 hover:bg-tobacco-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  <span>Contato</span>
                </Link>
              </div>
            </nav>

            <div className="p-4 border-t border-tobacco-100 bg-tobacco-50 mt-auto">
              <p className="text-xs text-tobacco-500 text-center">
                ⚠️ Proibida a venda para menores de 18 anos
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
