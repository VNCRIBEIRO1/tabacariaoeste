import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Truck,
  Shield,
  CreditCard,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { HeroBanner } from "@/components/store/hero-banner"
import { NewsletterForm } from "@/components/store/newsletter-form"

async function getHomeData() {
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
}

export default async function HomePage() {
  const { banners, categories, featuredProducts, promoProducts, recentProducts } =
    await getHomeData()

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner banners={banners} />

      {/* Benefits Bar */}
      <section className="bg-stone-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 justify-center">
              <Truck className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Frete Grátis</p>
                <p className="text-xs text-gray-400">Acima de R$ 299</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Compra Segura</p>
                <p className="text-xs text-gray-400">100% protegida</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <CreditCard className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Até 12x</p>
                <p className="text-xs text-gray-400">Sem juros no cartão</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Star className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Qualidade</p>
                <p className="text-xs text-gray-400">Produtos selecionados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              Nossas Categorias
            </h2>
            <p className="text-gray-600 mt-2">
              Explore nossa seleção de produtos premium
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative overflow-hidden rounded-xl bg-stone-100 aspect-square flex items-center justify-center hover:shadow-lg transition-all"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative z-10 text-center">
                  {cat.icon && <span className="text-4xl mb-2 block">{cat.icon}</span>}
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
                  Destaques
                </h2>
                <p className="text-gray-600 mt-1">Os mais procurados</p>
              </div>
              <Link
                href="/busca?featured=true"
                className="text-amber-700 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
              >
                Ver Todos <ArrowRight className="h-4 w-4" />
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
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-800 to-stone-900 text-white py-16 px-8 md:px-16">
            <div className="relative z-10 max-w-lg">
              <Badge className="bg-amber-500 text-white mb-4">Oferta Especial</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frete Grátis em Compras Acima de R$ 299
              </h2>
              <p className="text-amber-100 mb-6">
                Aproveite condições especiais e receba seus produtos favoritos no conforto da sua casa.
              </p>
              <Link href="/categoria/charutos">
                <Button className="bg-white text-stone-900 hover:bg-gray-100">
                  Aproveitar Oferta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Products */}
      {promoProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
                  🔥 Promoções
                </h2>
                <p className="text-gray-600 mt-1">Preços imperdíveis</p>
              </div>
              <Link
                href="/busca?promo=true"
                className="text-amber-700 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
              >
                Ver Todos <ArrowRight className="h-4 w-4" />
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
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
                  Novidades
                </h2>
                <p className="text-gray-600 mt-1">Recém chegados</p>
              </div>
              <Link
                href="/busca?sort=newest"
                className="text-amber-700 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
              >
                Ver Todos <ArrowRight className="h-4 w-4" />
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
      <section className="py-16 bg-stone-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Receba Ofertas Exclusivas
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Cadastre-se e receba promoções, lançamentos e novidades diretamente no seu e-mail.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}
