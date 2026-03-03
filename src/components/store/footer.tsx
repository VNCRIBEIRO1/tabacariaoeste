import Link from "next/link"
import { Instagram, Facebook, Youtube, Phone, MapPin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-stone-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              <span className="text-amber-500">OESTE</span> TABACARIA
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              A melhor tabacaria de Presidente Prudente. Charutos, acessórios,
              head shop e muito mais. Qualidade e tradição desde 2020.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categoria/charutos" className="hover:text-amber-500 transition-colors">Charutos</Link></li>
              <li><Link href="/categoria/cigarrilhas" className="hover:text-amber-500 transition-colors">Cigarrilhas</Link></li>
              <li><Link href="/categoria/acessorios" className="hover:text-amber-500 transition-colors">Acessórios</Link></li>
              <li><Link href="/categoria/isqueiros" className="hover:text-amber-500 transition-colors">Isqueiros</Link></li>
              <li><Link href="/categoria/head-shop" className="hover:text-amber-500 transition-colors">Head Shop</Link></li>
              <li><Link href="/categoria/bebidas" className="hover:text-amber-500 transition-colors">Bebidas</Link></li>
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="text-white font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sobre" className="hover:text-amber-500 transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-amber-500 transition-colors">Contato</Link></li>
              <li><Link href="/politica-de-privacidade" className="hover:text-amber-500 transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos-de-uso" className="hover:text-amber-500 transition-colors">Termos de Uso</Link></li>
              <li><Link href="/trocas-e-devolucoes" className="hover:text-amber-500 transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/rastreio" className="hover:text-amber-500 transition-colors">Rastrear Pedido</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP, 19010-270</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <a href="tel:+5518988176442" className="hover:text-amber-500">(18) 98817-6442</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <a href="mailto:contato@oestetabacaria.com.br" className="hover:text-amber-500">contato@oestetabacaria.com.br</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Oeste Tabacaria. Todos os direitos reservados.</p>
            <p>
              ⚠️ A venda de produtos derivados do tabaco é proibida para menores de 18 anos — Lei 8.069/1990
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
