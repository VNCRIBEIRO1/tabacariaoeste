import { config } from "dotenv"
config({ path: ".env.local", override: true })

import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const client = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon(client)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@oestetabacaria.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@oestetabacaria.com.br",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "(18) 98817-6442",
    },
  })
  console.log("Admin user created:", admin.email)

  // Categories
  const cat1 = await prisma.category.upsert({
    where: { slug: "cigarros-e-fumos" },
    update: {},
    create: {
      name: "Cigarros e Fumos",
      slug: "cigarros-e-fumos",
      description: "Cigarros nacionais e importados, fumos para cachimbo e enrolar.",
      image: "/images/categories/cigarros.jpg",
      order: 1,
      active: true,
    },
  })

  const cat2 = await prisma.category.upsert({
    where: { slug: "acessorios" },
    update: {},
    create: {
      name: "Acessorios",
      slug: "acessorios",
      description: "Isqueiros, piteiras, cortadores, cases e acessorios para tabacaria.",
      image: "/images/categories/acessorios.jpg",
      order: 2,
      active: true,
    },
  })

  const cat3 = await prisma.category.upsert({
    where: { slug: "narguile-e-essencias" },
    update: {},
    create: {
      name: "Narguile e Essencias",
      slug: "narguile-e-essencias",
      description: "Narguiles, essencias, carvoes e acessorios para narguile.",
      image: "/images/categories/narguile.jpg",
      order: 3,
      active: true,
    },
  })

  console.log("Categories created:", cat1.name, cat2.name, cat3.name)

  // Products
  const products = [
    // Cigarros e Fumos (7)
    {
      name: "Cigarro Marlboro Red Box",
      slug: "cigarro-marlboro-red-box",
      description: "Cigarro Marlboro Red Box, maco com 20 unidades. Sabor classico e marcante.",
      shortDescription: "Marlboro Red classico, maco com 20 unidades.",
      sku: "CIG-MARL-RED",
      price: 14.50,
      categoryId: cat1.id,
      stock: 200,
      minStock: 20,
      trackStock: true,
      weight: 0.05,
      active: true,
      featured: true,
      salesCount: 150,
    },
    {
      name: "Cigarro Camel Blue",
      slug: "cigarro-camel-blue",
      description: "Cigarro Camel Blue, suave e encorpado. Maco com 20 unidades.",
      shortDescription: "Camel Blue suave, 20 unidades.",
      sku: "CIG-CAMEL-BLU",
      price: 13.00,
      categoryId: cat1.id,
      stock: 150,
      minStock: 15,
      trackStock: true,
      weight: 0.05,
      active: true,
      salesCount: 80,
    },
    {
      name: "Cigarro Lucky Strike Original",
      slug: "cigarro-lucky-strike-original",
      description: "Lucky Strike Original, o classico americano. Maco com 20 unidades.",
      shortDescription: "Lucky Strike Original, 20 unidades.",
      sku: "CIG-LUCKY-ORI",
      price: 12.50,
      categoryId: cat1.id,
      stock: 120,
      minStock: 15,
      trackStock: true,
      weight: 0.05,
      active: true,
      salesCount: 65,
    },
    {
      name: "Fumo Manitou Organic Green",
      slug: "fumo-manitou-organic-green",
      description: "Fumo organico Manitou Green para enrolar. Pacote de 30g. Sabor suave e natural.",
      shortDescription: "Fumo organico Manitou 30g.",
      sku: "FUM-MAN-GREEN",
      price: 22.90,
      categoryId: cat1.id,
      stock: 80,
      minStock: 10,
      trackStock: true,
      weight: 0.03,
      active: true,
      featured: true,
      salesCount: 95,
    },
    {
      name: "Fumo Hi Tobacco Virginia",
      slug: "fumo-hi-tobacco-virginia",
      description: "Fumo Hi Tobacco Virginia Blend, 25g. Corte fino para enrolar.",
      shortDescription: "Fumo Hi Tobacco Virginia 25g.",
      sku: "FUM-HI-VIRG",
      price: 18.90,
      categoryId: cat1.id,
      stock: 90,
      minStock: 10,
      trackStock: true,
      weight: 0.025,
      active: true,
      salesCount: 55,
    },
    {
      name: "Cigarro Dunhill Carlton",
      slug: "cigarro-dunhill-carlton",
      description: "Dunhill Carlton, suavidade premium. Maco com 20 unidades.",
      shortDescription: "Dunhill Carlton, 20 unidades.",
      sku: "CIG-DUN-CARL",
      price: 15.00,
      categoryId: cat1.id,
      stock: 100,
      minStock: 10,
      trackStock: true,
      weight: 0.05,
      active: true,
      salesCount: 40,
    },
    {
      name: "Papel para Enrolar Smoking Brown",
      slug: "papel-para-enrolar-smoking-brown",
      description: "Seda Smoking Brown, papel nao branqueado. Livreto com 50 folhas. King Size.",
      shortDescription: "Seda Smoking Brown KS, 50 folhas.",
      sku: "PAP-SMOK-BRN",
      price: 5.90,
      categoryId: cat1.id,
      stock: 300,
      minStock: 30,
      trackStock: true,
      weight: 0.01,
      active: true,
      salesCount: 200,
    },
    // Acessorios (7)
    {
      name: "Isqueiro Zippo Classic Chrome",
      slug: "isqueiro-zippo-classic-chrome",
      description: "Isqueiro Zippo Classic cromado escovado. Original com garantia vitalicia. Made in USA.",
      shortDescription: "Zippo Classic Chrome original.",
      sku: "ACE-ZIPPO-CHR",
      price: 189.90,
      promoPrice: 159.90,
      categoryId: cat2.id,
      stock: 25,
      minStock: 5,
      trackStock: true,
      weight: 0.07,
      active: true,
      featured: true,
      salesCount: 35,
    },
    {
      name: "Isqueiro Clipper Sortido",
      slug: "isqueiro-clipper-sortido",
      description: "Isqueiro Clipper recarregavel, cores sortidas. Pedra substituivel. Unidade.",
      shortDescription: "Clipper recarregavel, cor sortida.",
      sku: "ACE-CLIP-SORT",
      price: 12.90,
      categoryId: cat2.id,
      stock: 200,
      minStock: 20,
      trackStock: true,
      weight: 0.03,
      active: true,
      salesCount: 180,
    },
    {
      name: "Piteira de Vidro Artesanal",
      slug: "piteira-de-vidro-artesanal",
      description: "Piteira de vidro borossilicato artesanal, resistente ao calor. Cores variadas.",
      shortDescription: "Piteira vidro artesanal.",
      sku: "ACE-PIT-VIDRO",
      price: 8.90,
      categoryId: cat2.id,
      stock: 150,
      minStock: 15,
      trackStock: true,
      weight: 0.01,
      active: true,
      salesCount: 120,
    },
    {
      name: "Dichavador Metal 4 Partes",
      slug: "dichavador-metal-4-partes",
      description: "Dichavador de metal com 4 partes, inclui compartimento coletor. 50mm de diametro.",
      shortDescription: "Dichavador metal 4 partes 50mm.",
      sku: "ACE-DICH-MET4",
      price: 34.90,
      promoPrice: 29.90,
      categoryId: cat2.id,
      stock: 60,
      minStock: 8,
      trackStock: true,
      weight: 0.15,
      active: true,
      featured: true,
      salesCount: 90,
    },
    {
      name: "Case para Cigarro Couro PU",
      slug: "case-para-cigarro-couro-pu",
      description: "Case porta cigarros em couro sintetico PU, comporta ate 20 cigarros. Fecho magnetico.",
      shortDescription: "Case couro PU para 20 cigarros.",
      sku: "ACE-CASE-PU",
      price: 29.90,
      categoryId: cat2.id,
      stock: 40,
      minStock: 5,
      trackStock: true,
      weight: 0.08,
      active: true,
      salesCount: 25,
    },
    {
      name: "Fluido para Isqueiro Zippo 125ml",
      slug: "fluido-zippo-125ml",
      description: "Fluido original Zippo para isqueiros, 125ml. Combustivel de alta pureza.",
      shortDescription: "Fluido Zippo original 125ml.",
      sku: "ACE-FLUID-ZIP",
      price: 39.90,
      categoryId: cat2.id,
      stock: 70,
      minStock: 10,
      trackStock: true,
      weight: 0.15,
      active: true,
      salesCount: 45,
    },
    {
      name: "Bolsa de Tabaco Roll Pouch",
      slug: "bolsa-tabaco-roll-pouch",
      description: "Bolsa porta tabaco estilo roll pouch, compartimento para seda e filtros. Material sintetico resistente.",
      shortDescription: "Bolsa porta tabaco roll pouch.",
      sku: "ACE-BOLSA-RP",
      price: 24.90,
      categoryId: cat2.id,
      stock: 45,
      minStock: 5,
      trackStock: true,
      weight: 0.06,
      active: true,
      salesCount: 30,
    },
    // Narguile e Essencias (6)
    {
      name: "Narguile Completo Zeus Thunder",
      slug: "narguile-completo-zeus-thunder",
      description: "Narguile Zeus Thunder completo com vaso, rosh, mangueira lavavel, prato e pinca. Altura 55cm. Cores sortidas.",
      shortDescription: "Narguile Zeus Thunder completo 55cm.",
      sku: "NAR-ZEUS-THUN",
      price: 249.90,
      promoPrice: 199.90,
      categoryId: cat3.id,
      stock: 15,
      minStock: 3,
      trackStock: true,
      weight: 2.5,
      height: 55,
      active: true,
      featured: true,
      salesCount: 20,
    },
    {
      name: "Essencia Adalya Love 66 50g",
      slug: "essencia-adalya-love-66-50g",
      description: "Essencia para narguile Adalya Love 66, sabor melancia com menta. 50g. Origem: Turquia.",
      shortDescription: "Adalya Love 66 50g.",
      sku: "ESS-ADAL-L66",
      price: 19.90,
      categoryId: cat3.id,
      stock: 100,
      minStock: 15,
      trackStock: true,
      weight: 0.05,
      active: true,
      salesCount: 130,
    },
    {
      name: "Essencia Zomo Strong Mint 50g",
      slug: "essencia-zomo-strong-mint-50g",
      description: "Essencia Zomo Strong Mint, menta intensa e refrescante. 50g.",
      shortDescription: "Zomo Strong Mint 50g.",
      sku: "ESS-ZOMO-MINT",
      price: 14.90,
      categoryId: cat3.id,
      stock: 120,
      minStock: 15,
      trackStock: true,
      weight: 0.05,
      active: true,
      salesCount: 110,
    },
    {
      name: "Carvao para Narguile Hexagonal 1kg",
      slug: "carvao-narguile-hexagonal-1kg",
      description: "Carvao de coco hexagonal para narguile. Caixa com 1kg (aprox. 72 unidades). Longa duracao.",
      shortDescription: "Carvao coco hexagonal 1kg.",
      sku: "NAR-CARV-HEX",
      price: 24.90,
      categoryId: cat3.id,
      stock: 50,
      minStock: 8,
      trackStock: true,
      weight: 1.0,
      active: true,
      salesCount: 85,
    },
    {
      name: "Rosh de Silicone Narguile",
      slug: "rosh-silicone-narguile",
      description: "Rosh (fornilho) de silicone resistente ao calor para narguile. Diversas cores. Facil limpeza.",
      shortDescription: "Rosh silicone para narguile.",
      sku: "NAR-ROSH-SIL",
      price: 19.90,
      categoryId: cat3.id,
      stock: 80,
      minStock: 10,
      trackStock: true,
      weight: 0.1,
      active: true,
      salesCount: 60,
    },
    {
      name: "Mangueira Lavavel Narguile Premium",
      slug: "mangueira-lavavel-narguile-premium",
      description: "Mangueira lavavel para narguile com bocal de aluminio. Comprimento 1,80m. Nao guarda sabor.",
      shortDescription: "Mangueira lavavel 1,80m.",
      sku: "NAR-MANG-PREM",
      price: 39.90,
      promoPrice: 34.90,
      categoryId: cat3.id,
      stock: 35,
      minStock: 5,
      trackStock: true,
      weight: 0.2,
      active: true,
      salesCount: 40,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log(`${products.length} products created`)

  // Banners
  await prisma.banner.upsert({
    where: { id: "banner-hero-1" },
    update: {},
    create: {
      id: "banner-hero-1",
      title: "Promocao de Narguiles - Ate 20% OFF",
      desktopImage: "/images/banners/hero-narguile-desktop.jpg",
      mobileImage: "/images/banners/hero-narguile-mobile.jpg",
      link: "/categoria/narguile-e-essencias",
      position: "HERO",
      order: 1,
      active: true,
    },
  })

  await prisma.banner.upsert({
    where: { id: "banner-hero-2" },
    update: {},
    create: {
      id: "banner-hero-2",
      title: "Novos Acessorios - Lancamentos em Isqueiros e Piteiras",
      desktopImage: "/images/banners/hero-acessorios-desktop.jpg",
      mobileImage: "/images/banners/hero-acessorios-mobile.jpg",
      link: "/categoria/acessorios",
      position: "HERO",
      order: 2,
      active: true,
    },
  })
  console.log("2 banners created")

  // Coupon
  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: {
      code: "BEMVINDO10",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 50,
      maxUses: 100,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      active: true,
    },
  })
  console.log("Coupon BEMVINDO10 created (10% off, min R$50)")

  // Store Settings
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "Oeste Tabacaria",
      email: "contato@oestetabacaria.com.br",
      phone: "(18) 98817-6442",
      whatsapp: "5518988176442",
      address: "Av. Manoel Goulart, 32 - Centro, Presidente Prudente - SP, 19010-270",
      metaTitle: "Oeste Tabacaria | Cigarros, Narguiles e Acessorios em Presidente Prudente",
      metaDescription: "Loja online da Oeste Tabacaria. Cigarros, fumos, narguiles, essencias e acessorios com os melhores precos. Entrega em Presidente Prudente e regiao.",
      freeShippingMin: 150,
    },
  })
  console.log("Store settings created")

  console.log("\nSeed completed successfully!")
  console.log("Admin login: admin@oestetabacaria.com.br / admin123")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
