import { FileText } from "lucide-react"

export const metadata = {
  title: "Termos de Uso | Oeste Tabacaria",
  description: "Termos de Uso da Oeste Tabacaria.",
}

export default function TermosDeUsoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-amber-700" />
          <h1 className="text-3xl font-bold text-stone-900">Termos de Uso</h1>
        </div>

        <p className="text-sm text-stone-400 mb-8">
          Última atualização: Março de 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              1. Aceitação dos Termos
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Ao acessar e utilizar o site da <strong>Oeste Tabacaria</strong>,
              você concorda integralmente com estes Termos de Uso. Caso não
              concorde com alguma disposição, pedimos que não utilize nosso site
              ou serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              2. Restrição de Idade
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Os produtos vendidos pela Oeste Tabacaria são destinados
              exclusivamente a maiores de 18 anos, conforme legislação
              brasileira vigente. Ao realizar uma compra, o cliente declara ser
              maior de idade. Reservamo-nos o direito de solicitar documento
              comprobatório a qualquer momento e cancelar pedidos de menores de
              idade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              3. Cadastro e Conta
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Para realizar compras, é necessário criar uma conta com
              informações verdadeiras e atualizadas. O cliente é responsável
              pela confidencialidade de sua senha e por todas as atividades
              realizadas em sua conta. Em caso de uso não autorizado, entre em
              contato conosco imediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              4. Produtos e Preços
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Os preços exibidos no site são em Reais (R$) e podem ser alterados
              sem aviso prévio. Fotos dos produtos são meramente ilustrativas e
              podem apresentar pequenas variações em relação ao produto real. Em
              caso de erro de precificação evidente, nos reservamos o direito de
              cancelar o pedido e reembolsar o cliente integralmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              5. Pagamento
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Aceitamos pagamentos via PIX, cartão de crédito, cartão de débito
              e boleto bancário. O processamento é realizado por gateways de
              pagamento seguros e certificados. A confirmação do pedido está
              sujeita à aprovação do pagamento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              6. Entrega
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Os prazos de entrega são estimados e contam a partir da
              confirmação do pagamento. A Oeste Tabacaria não se responsabiliza
              por atrasos causados por transportadoras, greves, desastres
              naturais ou quaisquer eventos de força maior. As entregas são
              realizadas em embalagem discreta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              7. Uso do Site
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Ao utilizar nosso site, o cliente se compromete a:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Não utilizar o site para fins ilícitos.</li>
              <li>
                Não tentar acessar áreas restritas ou interferir no
                funcionamento do site.
              </li>
              <li>Fornecer informações verdadeiras e atualizadas.</li>
              <li>
                Não reproduzir, distribuir ou modificar conteúdos do site sem
                autorização prévia.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              8. Propriedade Intelectual
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Todo o conteúdo do site, incluindo textos, imagens, logotipos,
              design e código-fonte, é de propriedade da Oeste Tabacaria ou de
              seus licenciadores e está protegido pela legislação de
              propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              9. Limitação de Responsabilidade
            </h2>
            <p className="text-stone-600 leading-relaxed">
              A Oeste Tabacaria não se responsabiliza por danos diretos ou
              indiretos resultantes do uso ou impossibilidade de uso do site,
              incluindo perda de dados, lucros cessantes ou interrupção de
              atividades, exceto nos casos previstos em lei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              10. Foro e Legislação Aplicável
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do
              Brasil. Fica eleito o foro da Comarca de Presidente Prudente - SP
              para dirimir quaisquer questões oriundas destes termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              11. Contato
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <div className="mt-3 bg-stone-50 rounded-lg p-4 text-sm text-stone-600">
              <p>
                <strong>Oeste Tabacaria</strong>
              </p>
              <p>Av. Manoel Goulart, 32 - Centro</p>
              <p>Pres. Prudente - SP, 19010-270</p>
              <p>WhatsApp: (18) 98817-6442</p>
              <p>E-mail: contato@oestetabacaria.com.br</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
