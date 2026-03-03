import {
  Award,
  ShieldCheck,
  Truck,
  Users,
  MapPin,
  Clock,
} from "lucide-react"

export const metadata = {
  title: "Sobre Nós | Oeste Tabacaria",
  description:
    "Conheça a Oeste Tabacaria, sua tabacaria de confiança em Presidente Prudente - SP.",
}

const values = [
  {
    icon: ShieldCheck,
    title: "Qualidade Garantida",
    description:
      "Trabalhamos apenas com produtos originais e de alta qualidade, garantindo a melhor experiência para nossos clientes.",
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description:
      "Enviamos para todo o Brasil com rapidez e segurança. Embalagens discretas e resistentes.",
  },
  {
    icon: Users,
    title: "Atendimento Especializado",
    description:
      "Nossa equipe é apaixonada pelo que faz e está pronta para ajudar você a encontrar o produto ideal.",
  },
  {
    icon: Award,
    title: "Tradição e Confiança",
    description:
      "Referência em Presidente Prudente e região, conquistamos a confiança de milhares de clientes.",
  },
]

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-tobacco-900 mb-4">
          Sobre a{" "}
          <span className="text-tobacco-600">Oeste Tabacaria</span>
        </h1>
        <p className="text-lg text-tobacco-600 leading-relaxed">
          Somos uma tabacaria especializada, localizada no coração de Presidente
          Prudente - SP. Há anos oferecemos os melhores produtos do segmento,
          desde sedas, bongs, pipes, narguile, essências e muito
          mais.
        </p>
      </div>

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-tobacco-900 mb-4">
            Nossa História
          </h2>
          <div className="space-y-4 text-tobacco-600 leading-relaxed">
            <p>
              A Oeste Tabacaria nasceu da paixão por produtos de qualidade e do
              desejo de oferecer uma experiência diferenciada aos amantes do
              segmento na região Oeste Paulista.
            </p>
            <p>
              Desde o início, nosso compromisso é trazer os melhores produtos
              nacionais e importados, com preços justos e atendimento
              personalizado. Nossa loja física em Presidente Prudente é ponto de
              referência para quem busca qualidade e variedade.
            </p>
            <p>
              Com a expansão para o e-commerce, agora levamos toda essa
              experiência para todo o Brasil, mantendo o mesmo cuidado e atenção
              que nos tornou referência na região.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-tobacco-50 to-tobacco-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-tobacco-700 mb-2">
              Oeste Tabacaria
            </h3>
            <p className="text-tobacco-500">Sua tabacaria de confiança</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-tobacco-900 text-center mb-8">
          Nossos Valores
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="text-center bg-white rounded-xl border border-tobacco-200 p-6 hover:shadow-md transition-shadow">
                  <div className="h-14 w-14 rounded-full bg-tobacco-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-tobacco-700" />
                  </div>
                  <h3 className="font-semibold text-tobacco-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-tobacco-500">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-tobacco-900 text-white rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Visite Nossa Loja
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-tobacco-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Endereço</h3>
              <p className="text-sm text-tobacco-300">
                Av. Manoel Goulart, 32 - Centro
                <br />
                Pres. Prudente - SP, 19010-270
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-tobacco-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Horário</h3>
              <p className="text-sm text-tobacco-300">
                Seg a Sex: 9h às 19h
                <br />
                Sáb: 9h às 14h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
