import { config } from "dotenv"
config({ path: ".env.local", override: true })

import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neon } from "@neondatabase/serverless"

const client = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon(client as any)
const prisma = new PrismaClient({ adapter })

// Update all product images and category images to use Unsplash direct URLs
const categoryImageMap: Record<string, string> = {
  charutos: "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=600&h=600&fit=crop&q=80",
  cigarrilhas: "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=600&h=600&fit=crop&q=80",
  "tabaco-cachimbo": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&h=600&fit=crop&q=80",
  acessorios: "https://images.unsplash.com/photo-1527529451874-f9deff87bb9e?w=600&h=600&fit=crop&q=80",
  isqueiros: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=600&h=600&fit=crop&q=80",
  "head-shop": "https://images.unsplash.com/photo-1560024882-b6fb1fe45556?w=600&h=600&fit=crop&q=80",
  bebidas: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=600&fit=crop&q=80",
  presentes: "https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=600&h=600&fit=crop&q=80",
}

const productImageMap: Record<string, string> = {
  "charuto-cohiba-robusto": "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=800&h=800&fit=crop&q=80",
  "charuto-montecristo-no-4": "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&h=800&fit=crop&q=80",
  "charuto-romeo-y-julieta-churchill": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&h=800&fit=crop&q=80",
  "charuto-partagas-serie-d-no-4": "https://images.unsplash.com/photo-1574027057806-b3402cb82969?w=800&h=800&fit=crop&q=80",
  "charuto-arturo-fuente-opus-x": "https://images.unsplash.com/photo-1598185788757-b6b415675821?w=800&h=800&fit=crop&q=80",
  "charuto-macanudo-cafe-hampton": "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=800&h=800&fit=crop&q=80",
  "charuto-h-upmann-magnum-50": "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&h=800&fit=crop&q=80",
  "charuto-bolivar-belicosos-finos": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&h=800&fit=crop&q=80",
  "cigarrilha-dannemann-speciale": "https://images.unsplash.com/photo-1574027057806-b3402cb82969?w=800&h=800&fit=crop&q=80",
  "cigarrilha-phillies-titan": "https://images.unsplash.com/photo-1598185788757-b6b415675821?w=800&h=800&fit=crop&q=80",
  "cigarrilha-cafe-creme-arome": "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=800&h=800&fit=crop&q=80",
  "tabaco-mac-baren-mixture-danish": "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&h=800&fit=crop&q=80",
  "tabaco-samuel-gawith-virginia": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&h=800&fit=crop&q=80",
  "cortador-xikar-xi2": "https://images.unsplash.com/photo-1527529451874-f9deff87bb9e?w=800&h=800&fit=crop&q=80",
  "umidificador-boveda-69": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop&q=80",
  "humidor-cedro-50-charutos": "https://images.unsplash.com/photo-1547887537-6158d64b35b3?w=800&h=800&fit=crop&q=80",
  "cinzeiro-outdoor-resistente": "https://images.unsplash.com/photo-1543386361-3185e4f52bb3?w=800&h=800&fit=crop&q=80",
  "isqueiro-st-dupont-maxijet": "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=800&h=800&fit=crop&q=80",
  "isqueiro-xikar-allume-double": "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=800&h=800&fit=crop&q=80",
  "isqueiro-clipper-classic": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=800&fit=crop&q=80",
  "dichavador-metal-4-partes": "https://images.unsplash.com/photo-1560024882-b6fb1fe45556?w=800&h=800&fit=crop&q=80",
  "seda-raw-classic-king-size": "https://images.unsplash.com/photo-1616486029378-1e70a228e5e5?w=800&h=800&fit=crop&q=80",
  "piteira-vidro-artesanal-8mm": "https://images.unsplash.com/photo-1585759065152-3b0e2524c3da?w=800&h=800&fit=crop&q=80",
  "whisky-glenfiddich-12-anos": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&h=800&fit=crop&q=80",
  "rum-zacapa-23-centenario": "https://images.unsplash.com/photo-1602767083170-4f73e9dfe3bf?w=800&h=800&fit=crop&q=80",
  "conhaque-hennessy-vs": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&h=800&fit=crop&q=80",
  "cerveja-belgian-tripel-artesanal": "https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?w=800&h=800&fit=crop&q=80",
  "kit-premium-charuto-isqueiro-cortador": "https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=800&h=800&fit=crop&q=80",
  "kit-degustacao-5-charutos": "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&h=800&fit=crop&q=80",
}

const bannerImages = [
  "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=1400&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574027057806-b3402cb82969?w=1400&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=1400&h=600&fit=crop&q=80",
]

async function fixImages() {
  console.log("Fixing all images to use Unsplash direct URLs...\n")

  // Fix categories
  for (const [slug, url] of Object.entries(categoryImageMap)) {
    await prisma.category.updateMany({ where: { slug }, data: { image: url } })
    console.log(`Category ${slug} -> image updated`)
  }

  // Fix products
  for (const [slug, url] of Object.entries(productImageMap)) {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (product) {
      await prisma.productImage.updateMany({
        where: { productId: product.id },
        data: { url, publicId: null },
      })
      console.log(`Product ${slug} -> image updated`)
    }
  }

  // Fix banners
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } })
  for (let i = 0; i < banners.length; i++) {
    if (bannerImages[i]) {
      await prisma.banner.update({
        where: { id: banners[i].id },
        data: { desktopImage: bannerImages[i], mobileImage: bannerImages[i] },
      })
      console.log(`Banner ${i} -> image updated`)
    }
  }

  console.log("\nAll images fixed!")
}

fixImages()
  .then(async () => { await prisma.$disconnect(); process.exit(0) })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
