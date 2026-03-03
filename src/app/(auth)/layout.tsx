import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <Link href="/" className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-stone-900">
          Oeste <span className="text-amber-700">Tabacaria</span>
        </h1>
        <p className="text-sm text-stone-500 mt-1">Sua tabacaria de confiança</p>
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Oeste Tabacaria. Todos os direitos reservados.
      </p>
    </div>
  )
}
