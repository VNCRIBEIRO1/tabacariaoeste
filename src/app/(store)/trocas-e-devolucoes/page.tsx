import { RefreshCw } from "lucide-react"

export const metadata = {
  title: "Trocas e Devoluções | Oeste Tabacaria",
  description:
    "Política de trocas e devoluções da Oeste Tabacaria. Saiba como solicitar troca ou devolução.",
}

export default function TrocasEDevolucoesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <RefreshCw className="h-8 w-8 text-amber-700" />
          <h1 className="text-3xl font-bold text-stone-900">
            Trocas e Devoluções
          </h1>
        </div>

        <p className="text-sm text-stone-400 mb-8">
          Última atualização: Março de 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              1. Direito de Arrependimento
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Conforme o Código de Defesa do Consumidor (Art. 49), o cliente tem
              o direito de desistir da compra em até <strong>7 dias corridos</strong>{" "}
              após o recebimento do produto, desde que o mesmo esteja em sua
              embalagem original, sem sinais de uso, lacrado e acompanhado da
              nota fiscal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              2. Condições para Troca
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              A troca de produtos será aceita nas seguintes condições:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>
                Produto recebido com defeito de fabricação.
              </li>
              <li>
                Produto divergente do pedido (modelo, sabor, tamanho diferente).
              </li>
              <li>
                Produto danificado durante o transporte.
              </li>
              <li>
                Solicitação dentro do prazo de 7 dias corridos após o
                recebimento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              3. Produtos Não Elegíveis
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Não aceitamos trocas ou devoluções nos seguintes casos:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Produtos com lacre violado ou sinais de uso.</li>
              <li>
                Essências, tabacos e produtos consumíveis já abertos.
              </li>
              <li>Produtos personalizados ou sob encomenda.</li>
              <li>Solicitações fora do prazo de 7 dias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              4. Como Solicitar
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Para solicitar uma troca ou devolução, siga os passos:
            </p>
            <ol className="list-decimal pl-6 text-stone-600 space-y-3">
              <li>
                <strong>Entre em contato:</strong> Envie uma mensagem via
                WhatsApp para{" "}
                <a
                  href="https://wa.me/5518988176442"
                  className="text-amber-700 hover:text-amber-800"
                >
                  (18) 98817-6442
                </a>{" "}
                ou por e-mail para contato@oestetabacaria.com.br informando o
                número do pedido e o motivo da troca/devolução.
              </li>
              <li>
                <strong>Aguarde aprovação:</strong> Nossa equipe analisará a
                solicitação em até 2 dias úteis e enviará as instruções para
                envio do produto.
              </li>
              <li>
                <strong>Envie o produto:</strong> Embale o produto de forma
                segura na embalagem original e envie conforme as instruções
                recebidas.
              </li>
              <li>
                <strong>Receba a troca ou reembolso:</strong> Após recebermos e
                conferirmos o produto, realizaremos a troca ou reembolso
                conforme sua preferência.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              5. Frete de Devolução
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Em caso de defeito de fabricação, produto divergente ou dano no
              transporte, o frete de devolução será por conta da{" "}
              <strong>Oeste Tabacaria</strong>. Em caso de arrependimento ou
              desistência por parte do cliente, o frete de devolução será de
              responsabilidade do cliente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              6. Reembolso
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              O reembolso será processado da seguinte forma:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>
                <strong>Cartão de crédito:</strong> Estorno na fatura em até 2
                ciclos de fechamento.
              </li>
              <li>
                <strong>PIX/Transferência:</strong> Reembolso em até 5 dias
                úteis após o recebimento do produto devolvido.
              </li>
              <li>
                <strong>Boleto:</strong> Reembolso via transferência bancária em
                até 10 dias úteis.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              7. Contato
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Para qualquer dúvida sobre trocas e devoluções:
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
