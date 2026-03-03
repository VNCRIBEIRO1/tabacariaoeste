import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Oeste Tabacaria | Charutos, Acessórios e Head Shop em Presidente Prudente",
    template: "%s | Oeste Tabacaria",
  },
  description:
    "A melhor tabacaria de Presidente Prudente. Charutos, cigarrilhas, acessórios, isqueiros, head shop e muito mais. Entrega para todo o Brasil.",
  keywords: [
    "tabacaria",
    "charutos",
    "presidente prudente",
    "head shop",
    "acessórios",
    "isqueiros",
    "cigarrilhas",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://oestetabacaria.com.br",
    siteName: "Oeste Tabacaria",
    title: "Oeste Tabacaria | Charutos, Acessórios e Head Shop",
    description: "A melhor tabacaria de Presidente Prudente.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
