"use client"

import Link from "next/link"
import { useState } from "react"
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
  ChevronDown,
} from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "Charutos", slug: "charutos" },
  { name: "Cigarrilhas", slug: "cigarrilhas" },
  { name: "Tabaco para Cachimbo", slug: "tabaco-cachimbo" },
  { name: "Acessórios", slug: "acessorios" },
  { name: "Isqueiros", slug: "isqueiros" },
  { name: "Head Shop", slug: "head-shop" },
  { name: "Bebidas", slug: "bebidas" },
  { name: "Presentes", slug: "presentes" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { getItemCount, openCart } = useCartStore()
  const itemCount = getItemCount()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-stone-900 text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              (18) 98817-6442
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-3.5 w-3.5 hover:text-amber-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-stone-900">
              <span className="text-amber-700">OESTE</span> TABACARIA
            </h1>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="lg:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/conta" className="hidden md:flex items-center gap-1 text-sm hover:text-amber-700">
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Minha Conta</span>
            </Link>

            <Link href="/conta/wishlist" className="hidden md:flex items-center gap-1 text-sm hover:text-amber-700">
              <Heart className="h-5 w-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative flex items-center gap-1 text-sm hover:text-amber-700"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden mt-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden lg:block border-t border-gray-100 bg-stone-50">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-0">
            <li>
              <Link
                href="/"
                className="block px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                Início
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="block px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contato"
                className="block px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link href="/" className="block py-2 text-stone-700 hover:text-amber-700" onClick={() => setMobileMenuOpen(false)}>
                  Início
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="block py-2 text-stone-700 hover:text-amber-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-100 pt-2 mt-2">
                <Link href="/conta" className="block py-2 text-stone-700 hover:text-amber-700" onClick={() => setMobileMenuOpen(false)}>
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/contato" className="block py-2 text-stone-700 hover:text-amber-700" onClick={() => setMobileMenuOpen(false)}>
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
