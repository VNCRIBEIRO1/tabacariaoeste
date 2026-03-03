import { Shield } from "lucide-react"

export const metadata = {
  title: "Política de Privacidade | Oeste Tabacaria",
  description: "Política de Privacidade da Oeste Tabacaria.",
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-amber-700" />
          <h1 className="text-3xl font-bold text-stone-900">
            Política de Privacidade
          </h1>
        </div>

        <p className="text-sm text-stone-400 mb-8">
          Última atualização: Março de 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              1. Informações Gerais
            </h2>
            <p className="text-stone-600 leading-relaxed">
              A <strong>Oeste Tabacaria</strong>, pessoa jurídica de direito
              privado, com sede na Av. Manoel Goulart, 32 - Centro, Presidente
              Prudente - SP, CEP 19010-270, é a controladora dos dados pessoais
              coletados neste site, comprometendo-se a garantir a privacidade e
              a proteção dos dados pessoais de seus clientes e visitantes,
              conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº
              13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              2. Dados Coletados
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Coletamos os seguintes dados pessoais:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>
                <strong>Dados de cadastro:</strong> nome, e-mail, CPF, telefone
                e data de nascimento.
              </li>
              <li>
                <strong>Dados de entrega:</strong> endereço completo (CEP, rua,
                número, complemento, bairro, cidade e estado).
              </li>
              <li>
                <strong>Dados de pagamento:</strong> processados de forma segura
                por meio de gateways de pagamento parceiros. Não armazenamos
                dados de cartão de crédito.
              </li>
              <li>
                <strong>Dados de navegação:</strong> cookies, endereço IP, tipo
                de navegador e páginas acessadas.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              3. Finalidade da Coleta
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Os dados são coletados para as seguintes finalidades:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Processamento e entrega de pedidos.</li>
              <li>Comunicação sobre status de pedidos e atualizações.</li>
              <li>Envio de promoções e novidades (com consentimento).</li>
              <li>Melhoria da experiência de navegação no site.</li>
              <li>Cumprimento de obrigações legais e regulatórias.</li>
              <li>Verificação de idade para venda de produtos restritos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Seus dados poderão ser compartilhados com terceiros apenas nas
              seguintes situações: transportadoras para entrega dos pedidos;
              gateways de pagamento para processamento financeiro; ferramentas
              de análise para melhoria do site; e em caso de determinação legal
              ou judicial. Não comercializamos dados pessoais em nenhuma
              circunstância.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              5. Armazenamento e Segurança
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Os dados pessoais são armazenados em servidores seguros, com
              criptografia SSL e acesso restrito. Adotamos medidas técnicas e
              organizacionais adequadas para proteger os dados contra acesso não
              autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              6. Direitos do Titular
            </h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Conforme a LGPD, você tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Confirmação da existência de tratamento de dados.</li>
              <li>Acesso aos dados pessoais coletados.</li>
              <li>Correção de dados incompletos ou desatualizados.</li>
              <li>Eliminação de dados desnecessários ou excessivos.</li>
              <li>Portabilidade dos dados a outro fornecedor.</li>
              <li>Revogação do consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              7. Cookies
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Utilizamos cookies para melhorar a experiência de navegação,
              lembrar preferências e analisar o tráfego do site. Você pode
              configurar seu navegador para recusar cookies, porém isso pode
              afetar a funcionalidade do site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              8. Contato
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta
              Política de Privacidade, entre em contato conosco:
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
