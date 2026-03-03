import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image,
  Tag,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/cupons", label: "Cupons", icon: Tag },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || !["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"].includes(session.user?.role)) {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-stone-800">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-lg font-bold">
              <span className="text-amber-500">OESTE</span> ADMIN
            </h1>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar à Loja
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-xs">
              {session.user?.name?.[0] || "A"}
            </div>
            <div className="truncate">
              <p className="text-white text-xs font-medium truncate">{session.user?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
