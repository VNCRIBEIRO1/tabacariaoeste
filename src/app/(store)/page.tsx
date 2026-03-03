import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/store/product-card"
import { ArrowRight, Flame, Sparkles, Gift, TrendingUp } from "lucide-react"
import { HeroBanner } from "@/components/store/hero-banner"
import { NewsletterForm } from "@/components/store/newsletter-form"

async function getHomeData() {
  try {
    const [banners, categories, featuredProducts, promoProducts, recentProducts] =
      await Promise.all([
        prisma.banner.findMany({
          where: {
            active: true,
            position: "HERO",
            OR: [
              { startDate: null, endDate: null },
              { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
              { startDate: { lte: new Date() }, endDate: null },
              { startDate: null, endDate: { gte: new Date() } },
            ],
          },
          orderBy: { order: "asc" },
          take: 5,
        }),
        prisma.category.findMany({
          where: { active: true, parentId: null },
          orderBy: { order: "asc" },
          take: 8,
        }),
        prisma.product.findMany({
          where: { active: true, featured: true },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: { select: { name: true } },
          },
          orderBy: { salesCount: "desc" },
          take: 8,
        }),
        prisma.product.findMany({
          where: {
            active: true,
            promoPrice: { not: null },
            OR: [
              { promoStart: null, promoEnd: null },
              { promoStart: { lte: new Date() }, promoEnd: { gte: new Date() } },
            ],
          },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: { select: { name: true } },
          },
          take: 8,
        }),
        prisma.product.findMany({
          where: { active: true },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      ])

    return { banners, categories, featuredProducts, promoProducts, recentProducts }
  } catch (error) {
    console.error("Error fetching home data:", error)
    return { banners: [], categories: [], featuredProducts: [], promoProducts: [], recentProducts: [] }
  }
}

export default async function HomePage() {
  const { banners, categories, featuredProducts, promoProducts, recentProducts } =
    await getHomeData()

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner banners={banners} />

      {/* Categories */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-tobacco-500 uppercase tracking-widest mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Explore
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-tobacco-900">
              Nossas Categorias
            </h2>
            <p className="text-tobacco-500 mt-2 max-w-md mx-auto">
              Produtos selecionados com a qualidade que você merece
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-tobacco-100 aspect-square flex items-center justify-center hover:shadow-xl hover:shadow-tobacco-200/40 transition-all duration-300"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-tobacco-950/80 via-tobacco-900/20 to-transparent" />
                <div className="relative z-10 text-center p-4">
                  {cat.icon && (
                    <span className="text-4xl mb-3 block drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-base md:text-lg drop-shadow-lg">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-14 bg-tobacco-50/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-tobacco-500 uppercase tracking-widest mb-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Mais Vendidos
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-tobacco-900">
                  Destaques
                </h2>
              </div>
              <Link
                href="/busca?featured=true"
                className="text-tobacco-600 hover:text-tobacco-800 text-sm font-semibold flex items-center gap-1 group"
              >
                Ver Todos
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-tobacco-800 via-tobacco-900 to-tobacco-950 text-white py-16 px-8 md:px-16">
            {/* Decorative elements */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 30%, rgba(212,127,37,0.4), transparent 50%)",
              }}
            />
            <div className="relative z-10 max-w-lg">
              <span className="inline-flex items-center gap-1.5 bg-tobacco-600/40 border border-tobacco-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-amber-300 mb-5">
                <Gift className="h-3.5 w-3.5" />
                Oferta Especial
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Frete Grátis em Compras Acima de R$ 299
              </h2>
              <p className="text-tobacco-200 mb-8 leading-relaxed">
                Aproveite condições especiais e receba seus produtos favoritos
                no conforto da sua casa. Use o cupom{" "}
                <span className="font-bold text-amber-300">BEMVINDO10</span>{" "}
                para 10% de desconto na primeira compra.
              </p>
              <Link
                href="/categoria/charutos"
                className="inline-flex items-center gap-2 bg-tobacco-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-tobacco-400 transition-all shadow-lg hover:shadow-xl"
              >
                Aproveitar Oferta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Products */}
      {promoProducts.length > 0 && (
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 uppercase tracking-widest mb-1">
                  <Flame className="h-3.5 w-3.5" />
                  Preços Imperdíveis
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-tobacco-900">
                  Promoções
                </h2>
              </div>
              <Link
                href="/busca?promo=true"
                className="text-tobacco-600 hover:text-tobacco-800 text-sm font-semibold flex items-center gap-1 group"
              >
                Ver Todos
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {promoProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <section className="py-14 bg-tobacco-50/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-tobacco-500 uppercase tracking-widest mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Recém Chegados
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-tobacco-900">
                  Novidades
                </h2>
              </div>
              <Link
                href="/busca?sort=newest"
                className="text-tobacco-600 hover:text-tobacco-800 text-sm font-semibold flex items-center gap-1 group"
              >
                Ver Todos
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {recentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-tobacco-900">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-tobacco-400 uppercase tracking-widest mb-3">
            Fique por dentro
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Receba Ofertas Exclusivas
          </h2>
          <p className="text-tobacco-400 mb-8 max-w-md mx-auto">
            Cadastre-se e receba promoções, lançamentos e novidades diretamente no seu e-mail.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}
