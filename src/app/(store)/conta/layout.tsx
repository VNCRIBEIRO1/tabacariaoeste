"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

const menuItems = [
  { href: "/conta", label: "Minha Conta", icon: User },
  { href: "/conta/pedidos", label: "Meus Pedidos", icon: ShoppingBag },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/dados", label: "Dados Pessoais", icon: Settings },
]

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Minha Conta</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-0 ${
                    isActive
                      ? "bg-amber-50 text-amber-700 border-l-2 border-l-amber-700"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
