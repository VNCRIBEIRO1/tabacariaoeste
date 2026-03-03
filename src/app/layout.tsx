import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Oeste Tabacaria | Charutos Premium, Acessórios e Head Shop",
    template: "%s | Oeste Tabacaria",
  },
  description:
    "A melhor tabacaria de Presidente Prudente. Charutos cubanos, cigarrilhas, acessórios premium, isqueiros, head shop, whiskies e muito mais. Entrega para todo o Brasil.",
  keywords: [
    "tabacaria", "charutos", "presidente prudente", "head shop",
    "acessórios", "isqueiros", "cigarrilhas", "whisky", "charuto cubano",
    "cohiba", "montecristo", "romeo y julieta",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://tabacaria-delta.vercel.app",
    siteName: "Oeste Tabacaria",
    title: "Oeste Tabacaria | Charutos Premium, Acessórios e Head Shop",
    description: "A melhor tabacaria de Presidente Prudente. Charutos, acessórios e muito mais.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: "var(--font-inter)" },
          }}
        />
      </body>
    </html>
  )
}
