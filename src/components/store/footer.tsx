import Link from "next/link"
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  MapPin,
  Mail,
  CreditCard,
  Shield,
  Truck,
  Clock,
} from "lucide-react"

const categories = [
  { name: "Sedas", slug: "sedas" },
  { name: "Bongs", slug: "bongs" },
  { name: "Pipes", slug: "pipes" },
  { name: "Narguile", slug: "narguile" },
  { name: "Essências", slug: "essencias" },
]

export function Footer() {
  return (
    <footer className="bg-tobacco-950 text-tobacco-300">
      {/* Trust badges */}
      <div className="border-b border-tobacco-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tobacco-800 flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-tobacco-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Frete Grátis</p>
                <p className="text-xs text-tobacco-400">Acima de R$ 299</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tobacco-800 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-tobacco-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">12x Sem Juros</p>
                <p className="text-xs text-tobacco-400">No cartão de crédito</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tobacco-800 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-tobacco-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Compra Segura</p>
                <p className="text-xs text-tobacco-400">Ambiente protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tobacco-800 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-tobacco-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Envio Rápido</p>
                <p className="text-xs text-tobacco-400">Postamos em 24h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tobacco-600 to-tobacco-800 flex items-center justify-center text-white font-bold text-xs">
                OT
              </div>
              <h3 className="text-white text-lg font-bold">
                <span className="text-tobacco-400">OESTE</span> TABACARIA
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-tobacco-400">
              A melhor tabacaria de Presidente Prudente. Sedas, bongs, pipes,
              narguile, essências e acessórios. Qualidade e tradição desde 2020.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/oestetabacaria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-tobacco-800 flex items-center justify-center hover:bg-tobacco-700 hover:text-amber-400 transition-all"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-tobacco-800 flex items-center justify-center hover:bg-tobacco-700 hover:text-amber-400 transition-all"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-tobacco-800 flex items-center justify-center hover:bg-tobacco-700 hover:text-amber-400 transition-all"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Categorias
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Institucional
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/sobre" className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/rastreio" className="hover:text-tobacco-100 hover:pl-1 transition-all duration-200">
                  Rastrear Pedido
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contato
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-tobacco-500" />
                <span>
                  Av. Manoel Goulart, 32<br />
                  Centro, Pres. Prudente - SP<br />
                  CEP 19010-270
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0 text-tobacco-500" />
                <a href="tel:+5518988176442" className="hover:text-tobacco-100 transition-colors">
                  (18) 98817-6442
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0 text-tobacco-500" />
                <a href="mailto:contato@oestetabacaria.com.br" className="hover:text-tobacco-100 transition-colors">
                  contato@oestetabacaria.com.br
                </a>
              </li>
            </ul>

            <div className="mt-5 pt-5 border-t border-tobacco-800">
              <p className="text-xs text-tobacco-500 mb-2">Formas de pagamento</p>
              <div className="flex items-center gap-2 text-tobacco-400">
                <span className="px-2 py-1 bg-tobacco-800 rounded text-[10px] font-medium">PIX</span>
                <span className="px-2 py-1 bg-tobacco-800 rounded text-[10px] font-medium">VISA</span>
                <span className="px-2 py-1 bg-tobacco-800 rounded text-[10px] font-medium">MASTER</span>
                <span className="px-2 py-1 bg-tobacco-800 rounded text-[10px] font-medium">BOLETO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-tobacco-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-tobacco-500">
            <p>&copy; {new Date().getFullYear()} Oeste Tabacaria. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
            <p className="flex items-center gap-1.5">
              ⚠️ A venda de produtos derivados do tabaco é proibida para menores de 18 anos — Lei 8.069/1990
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
