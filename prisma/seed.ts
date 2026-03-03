import { PrismaClient } from "@prisma/client"
import { neon } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { config } from "dotenv"

config({ path: ".env" })
config({ path: ".env.local", override: true })

const connectionString = process.env.DATABASE_URL!
const client = neon(connectionString)
const adapter = new PrismaNeon(client as any)
const prisma = new PrismaClient({ adapter })

// Unsplash direct image URLs
const IMG = {
  catCharutos: "https://images.unsplash.com/photo-1589279003513-467d320f47eb?w=600&h=600&fit=crop",
  catCigarrilhas: "https://images.unsplash.com/photo-1574027057793-2e2abaa7d8bf?w=600&h=600&fit=crop",
  catTabaco: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=600&fit=crop",
  catAcessorios: "https://images.unsplash.com/photo-1605791965540-0f5c6e6e81f3?w=600&h=600&fit=crop",
  catIsqueiros: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&h=600&fit=crop",
  catHeadShop: "https://images.unsplash.com/photo-1616712134411-6b6ae89bc3ba?w=600&h=600&fit=crop",
  catBebidas: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=600&fit=crop",
  catPresentes: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=600&fit=crop",
  charuto1: "https://images.unsplash.com/photo-1589279003513-467d320f47eb?w=800&h=800&fit=crop",
  charuto2: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=800&h=800&fit=crop",
  charuto3: "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=800&h=800&fit=crop",
  charuto4: "https://images.unsplash.com/photo-1574027057793-2e2abaa7d8bf?w=800&h=800&fit=crop",
  charuto5: "https://images.unsplash.com/photo-1612985605436-94cf3defc1b8?w=800&h=800&fit=crop",
  whisky1: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&h=800&fit=crop",
  whisky2: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&h=800&fit=crop",
  whisky3: "https://images.unsplash.com/photo-1602081115068-1e4e355e43ca?w=800&h=800&fit=crop",
  isqueiro1: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&h=800&fit=crop",
  isqueiro2: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop",
  acessorio1: "https://images.unsplash.com/photo-1605791965540-0f5c6e6e81f3?w=800&h=800&fit=crop",
  acessorio2: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&h=800&fit=crop",
  banner1: "https://images.unsplash.com/photo-1589279003513-467d320f47eb?w=1400&h=550&fit=crop",
  banner2: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1400&h=550&fit=crop",
  banner3: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1400&h=550&fit=crop",
  banner4: "https://images.unsplash.com/photo-1574027057793-2e2abaa7d8bf?w=1400&h=550&fit=crop",
}

async function main() {
  console.log("Limpando banco...")
  await prisma.orderStatusHistory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.shippingZone.deleteMany()
  await prisma.storeSettings.deleteMany()
  await prisma.address.deleteMany()
  console.log("Banco limpo!")

  // CATEGORIES
  console.log("Criando categorias...")
  const cats = await Promise.all([
    prisma.category.create({ data: { name: "Charutos", slug: "charutos", icon: "🪵", description: "Os melhores charutos cubanos e de origens premium do mundo.", image: IMG.catCharutos, order: 1, active: true } }),
    prisma.category.create({ data: { name: "Cigarrilhas", slug: "cigarrilhas", icon: "🚬", description: "Cigarrilhas finas das melhores marcas.", image: IMG.catCigarrilhas, order: 2, active: true } }),
    prisma.category.create({ data: { name: "Tabaco p/ Cachimbo", slug: "tabaco-cachimbo", icon: "🫧", description: "Tabacos aromáticos e blends exclusivos para cachimbo.", image: IMG.catTabaco, order: 3, active: true } }),
    prisma.category.create({ data: { name: "Acessórios", slug: "acessorios", icon: "✂️", description: "Cortadores, humidores, cinzeiros e tudo para o ritual perfeito.", image: IMG.catAcessorios, order: 4, active: true } }),
    prisma.category.create({ data: { name: "Isqueiros", slug: "isqueiros", icon: "🔥", description: "Isqueiros premium para charutos e cachimbos.", image: IMG.catIsqueiros, order: 5, active: true } }),
    prisma.category.create({ data: { name: "Head Shop", slug: "head-shop", icon: "🌿", description: "Sedas, dichavadores, bongs e mais.", image: IMG.catHeadShop, order: 6, active: true } }),
    prisma.category.create({ data: { name: "Bebidas", slug: "bebidas", icon: "🥃", description: "Whiskies single malt, rum premium e licores.", image: IMG.catBebidas, order: 7, active: true } }),
    prisma.category.create({ data: { name: "Presentes", slug: "presentes", icon: "🎁", description: "Kits presente para surpreender.", image: IMG.catPresentes, order: 8, active: true } }),
  ])
  const [catC, catCig, catT, catA, catI, catH, catB, catP] = cats

  // PRODUCTS
  console.log("Criando produtos...")
  const products = [
    { name: "Cohiba Behike 56", slug: "cohiba-behike-56", sku: "CHR-001", shortDescription: "O charuto mais exclusivo da Cohiba. Blend raro com folha Medio Tiempo.", description: "O Cohiba Behike 56 representa o apice da arte do charuto. Utiliza a rara folha Medio Tiempo, proporcionando sabor excepcionalmente rico e complexo com notas de cacau, cafe, couro e especiarias.", categoryId: catC.id, brand: "Cohiba", origin: "Cuba", tags: ["premium","cubano","exclusivo"], price: 890.00, stock: 12, featured: true, salesCount: 45, img: IMG.charuto1 },
    { name: "Montecristo No. 2", slug: "montecristo-no-2", sku: "CHR-002", shortDescription: "O torpedo cubano mais famoso do mundo.", description: "Vitola torpedo (Piramide) com 52 de cepo e 156mm. Notas de nozes torradas, cafe expresso, terra e pimenta branca. Queima uniforme e draw perfeito.", categoryId: catC.id, brand: "Montecristo", origin: "Cuba", tags: ["cubano","torpedo"], price: 320.00, promoPrice: 279.90, stock: 28, featured: true, salesCount: 89, img: IMG.charuto2 },
    { name: "Romeo y Julieta Churchill", slug: "romeo-y-julieta-churchill", sku: "CHR-003", shortDescription: "Nomeado em homenagem a Winston Churchill.", description: "Vitola Churchill com 47 de cepo e 178mm. Sabor medio com notas de cedro, baunilha, couro e especiarias doces. Queima longa de 90 minutos.", categoryId: catC.id, brand: "Romeo y Julieta", origin: "Cuba", tags: ["cubano","churchill"], price: 250.00, stock: 35, featured: true, salesCount: 67, img: IMG.charuto3 },
    { name: "Arturo Fuente Opus X", slug: "arturo-fuente-opus-x", sku: "CHR-004", shortDescription: "Lendario charuto dominicano com capa Rosado exclusiva.", description: "Capa Rosado cultivada na Fazenda Chateau de la Fuente. Sabor encorpado com notas de pimenta, couro, cafe e final longo e doce.", categoryId: catC.id, brand: "Arturo Fuente", origin: "Republica Dominicana", tags: ["premium","dominicano"], price: 580.00, promoPrice: 499.00, stock: 8, featured: true, salesCount: 34, img: IMG.charuto4 },
    { name: "Padron 1964 Anniversary Maduro", slug: "padron-1964-maduro", sku: "CHR-005", shortDescription: "Charuto nicaraguano envelhecido 4 anos.", description: "Todos os tabacos envelhecidos por 4 anos. Capa Maduro com notas de chocolate amargo, cafe torrado e nozes.", categoryId: catC.id, brand: "Padron", origin: "Nicaragua", tags: ["premium","maduro"], price: 420.00, stock: 15, featured: true, salesCount: 56, img: IMG.charuto5 },
    { name: "H. Upmann Magnum 50", slug: "h-upmann-magnum-50", sku: "CHR-006", shortDescription: "Robusto cubano elegante com notas de cedro e mel.", description: "Vitola Robusto Extra com 50 de cepo. Sabor medio-leve com notas de cedro, mel, noz-moscada e pao torrado.", categoryId: catC.id, brand: "H. Upmann", origin: "Cuba", tags: ["cubano","robusto"], price: 185.00, promoPrice: 159.90, stock: 42, featured: false, salesCount: 73, img: IMG.charuto1 },
    { name: "Davidoff Grand Cru No. 2", slug: "davidoff-grand-cru-no-2", sku: "CHR-007", shortDescription: "Elegancia suica com tabaco dominicano.", description: "Sabor leve a medio com notas cremosas, amendoim, cedro e flores brancas. Construcao perfeita.", categoryId: catC.id, brand: "Davidoff", origin: "Republica Dominicana", tags: ["premium","suave"], price: 340.00, stock: 20, featured: false, salesCount: 28, img: IMG.charuto2 },
    { name: "Bolivar Royal Corona", slug: "bolivar-royal-corona", sku: "CHR-008", shortDescription: "Um dos charutos cubanos mais encorpados.", description: "Robusto com 50 de cepo. Sabor encorpado e terroso com notas de madeira, cafe e pimenta negra. Para fumantes experientes.", categoryId: catC.id, brand: "Bolivar", origin: "Cuba", tags: ["cubano","encorpado"], price: 210.00, promoPrice: 189.90, stock: 30, featured: false, salesCount: 51, img: IMG.charuto3 },

    // Cigarrilhas
    { name: "Cohiba Short", slug: "cohiba-short", sku: "CIG-001", shortDescription: "Cigarrilha premium da Cohiba em 10 minutos.", description: "Com 88mm e 26 de cepo, oferece o sabor Cohiba em fumada rapida. Notas de mel, noz e especiarias. Caixa com 10.", categoryId: catCig.id, brand: "Cohiba", origin: "Cuba", tags: ["cubano","premium"], price: 280.00, promoPrice: 249.90, stock: 50, featured: true, salesCount: 112, img: IMG.charuto4 },
    { name: "Dannemann Moods", slug: "dannemann-moods", sku: "CIG-002", shortDescription: "Cigarrilha suave com filtro, tabaco brasileiro.", description: "Tabaco brasileiro premium da Bahia. Suave e aromatica. 70mm, fumada de 8 minutos. Caixa com 20.", categoryId: catCig.id, brand: "Dannemann", origin: "Brasil", tags: ["brasileiro","suave"], price: 45.00, stock: 80, featured: false, salesCount: 95, img: IMG.charuto3 },
    { name: "Villiger Premium No. 1 Sumatra", slug: "villiger-premium-no-1", sku: "CIG-003", shortDescription: "Cigarrilha suica com capa Sumatra.", description: "Fabricacao suica com capa Sumatra da Indonesia. Sabor leve e adocicado com notas de madeira. Caixa com 5.", categoryId: catCig.id, brand: "Villiger", origin: "Suica", tags: ["suico","sumatra"], price: 65.00, stock: 60, featured: false, salesCount: 43, img: IMG.charuto5 },

    // Tabaco
    { name: "Peterson Irish Oak", slug: "peterson-irish-oak", sku: "TAB-001", shortDescription: "Tabaco irlandes envelhecido em barris de carvalho.", description: "Blend de Virginia e Burley envelhecido em barris de carvalho irlandes. Notas de baunilha, caramelo e madeira. Lata 50g.", categoryId: catT.id, brand: "Peterson", origin: "Irlanda", tags: ["irlandes","aromatico"], price: 195.00, promoPrice: 169.90, stock: 25, featured: true, salesCount: 38, img: IMG.catTabaco },
    { name: "Dunhill Nightcap", slug: "dunhill-nightcap", sku: "TAB-002", shortDescription: "Blend encorpado ingles com Latakia e Perique.", description: "Combinacao de Latakia sirio, Perique da Louisiana e Virginia prensado. Sabor intenso e complexo. Lata 50g.", categoryId: catT.id, brand: "Dunhill", origin: "Inglaterra", tags: ["ingles","encorpado"], price: 220.00, stock: 18, featured: false, salesCount: 29, img: IMG.catTabaco },

    // Acessorios
    { name: "Humidor 100 Charutos Cedro Espanhol", slug: "humidor-100-cedro-espanhol", sku: "ACE-001", shortDescription: "Humidor luxuoso para 100 charutos com higrometro digital.", description: "Interior em cedro espanhol. Higrometro digital, divisorias removiveis e bandeja superior. Acabamento em ebano. 35x25x15cm.", categoryId: catA.id, brand: "Oeste Tabacaria", origin: "Brasil", tags: ["humidor","cedro"], price: 890.00, promoPrice: 749.00, stock: 8, featured: true, salesCount: 22, img: IMG.acessorio1 },
    { name: "Cortador Xikar Xi2", slug: "cortador-xikar-xi2", sku: "ACE-002", shortDescription: "Cortador guilhotina dupla em aco 440C.", description: "Laminas de aco inoxidavel 440C afiadas a laser. Corte preciso ate 60 de cepo. Acabamento fibra de carbono. Garantia vitalicia.", categoryId: catA.id, brand: "Xikar", origin: "EUA", tags: ["cortador","xikar"], price: 320.00, stock: 15, featured: true, salesCount: 67, img: IMG.acessorio2 },
    { name: "Cinzeiro Cristal 4 Posicoes", slug: "cinzeiro-cristal-4-posicoes", sku: "ACE-003", shortDescription: "Cinzeiro de cristal artesanal com 4 apoios.", description: "Cristal transparente feito a mao. 4 posicoes para charutos de diferentes cepos. Base pesada. Diametro 18cm.", categoryId: catA.id, brand: "Oeste Tabacaria", origin: "Brasil", tags: ["cinzeiro","cristal"], price: 180.00, promoPrice: 149.90, stock: 20, featured: false, salesCount: 41, img: IMG.acessorio1 },
    { name: "Case de Viagem 3 Charutos", slug: "case-viagem-3-charutos", sku: "ACE-004", shortDescription: "Case de couro legitimo para 3 charutos com tubo de cedro.", description: "Couro italiano legitimo com interior em cedro espanhol. Acomoda 3 charutos de ate 52 de cepo. Fechamento magnetico. Compacto e elegante.", categoryId: catA.id, brand: "Oeste Tabacaria", origin: "Italia", tags: ["case","couro","viagem"], price: 290.00, stock: 12, featured: false, salesCount: 35, img: IMG.acessorio2 },

    // Isqueiros
    { name: "S.T. Dupont Ligne 2 Black Lacquer", slug: "st-dupont-ligne-2-black", sku: "ISQ-001", shortDescription: "O isqueiro mais iconico do mundo. Lacado a mao.", description: "12 camadas de laca chinesa preta. Acabamento palladium. O famoso 'cling' ao abrir. Chama ajustavel ideal para charutos.", categoryId: catI.id, brand: "S.T. Dupont", origin: "Franca", tags: ["premium","luxo"], price: 4500.00, stock: 3, featured: true, salesCount: 8, img: IMG.isqueiro1 },
    { name: "Xikar Allume Triple Jet", slug: "xikar-allume-triple-jet", sku: "ISQ-002", shortDescription: "Isqueiro triple jet a prova de vento.", description: "Tres jatos turbo para acendimento rapido e uniforme. A prova de vento. Tanque com visor de nivel. Garantia vitalicia.", categoryId: catI.id, brand: "Xikar", origin: "EUA", tags: ["triple-jet","xikar"], price: 480.00, promoPrice: 399.90, stock: 12, featured: true, salesCount: 45, img: IMG.isqueiro2 },
    { name: "Zippo Classic Chrome", slug: "zippo-classic-chrome", sku: "ISQ-003", shortDescription: "O classico americano desde 1932.", description: "Aco cromado espelhado. Chama a prova de vento. Garantia vitalicia Zippo. Acompanha caixa original.", categoryId: catI.id, brand: "Zippo", origin: "EUA", tags: ["classico","americano"], price: 189.90, stock: 30, featured: false, salesCount: 88, img: IMG.isqueiro1 },

    // Head Shop
    { name: "Kit Seda OCB Premium Slim", slug: "kit-seda-ocb-premium-slim", sku: "HS-001", shortDescription: "Pack com 50 sedas OCB Premium Slim.", description: "Fibras de linho natural, sem cloro. Queima lenta e uniforme. 50 livretos x 32 folhas. King Size Slim.", categoryId: catH.id, brand: "OCB", origin: "Franca", tags: ["seda","slim"], price: 89.90, promoPrice: 74.90, stock: 100, featured: false, salesCount: 156, img: IMG.catHeadShop },
    { name: "Dichavador Santa Cruz Shredder 4P", slug: "dichavador-santa-cruz-4p", sku: "HS-002", shortDescription: "Aluminio aeronautico 6061-T6 anodizado.", description: "4 partes com peneira de aco inox. Dentes patenteados. Ima de neodimio. Diametro 55mm. Made in USA.", categoryId: catH.id, brand: "Santa Cruz", origin: "EUA", tags: ["dichavador","aluminio"], price: 250.00, stock: 20, featured: true, salesCount: 72, img: IMG.catHeadShop },

    // Bebidas
    { name: "Macallan 18 Years Sherry Oak", slug: "macallan-18-sherry-oak", sku: "BEB-001", shortDescription: "Single malt escoces 18 anos em barris de sherry.", description: "Maturado em barris de carvalho sherry Oloroso por 18 anos. Notas de frutas secas, chocolate, gengibre e laranja cristalizada. 43% ABV. 700ml.", categoryId: catB.id, brand: "Macallan", origin: "Escocia", tags: ["whisky","single-malt","18-anos"], price: 2800.00, stock: 5, featured: true, salesCount: 12, img: IMG.whisky1 },
    { name: "Glenfiddich 15 Solera Reserve", slug: "glenfiddich-15-solera", sku: "BEB-002", shortDescription: "Single malt 15 anos com sistema Solera unico.", description: "Barris de bourbon, sherry novo e velho em tina Solera. Notas de mel, baunilha, canela e frutas assadas. 40% ABV. 750ml.", categoryId: catB.id, brand: "Glenfiddich", origin: "Escocia", tags: ["whisky","single-malt","15-anos"], price: 590.00, promoPrice: 519.90, stock: 15, featured: true, salesCount: 34, img: IMG.whisky2 },
    { name: "Ron Zacapa Centenario 23", slug: "ron-zacapa-centenario-23", sku: "BEB-003", shortDescription: "Rum guatemalteco envelhecido ate 23 anos.", description: "Produzido a 2.300m de altitude. Barris de bourbon, sherry e Pedro Ximenez. Notas de caramelo, baunilha e chocolate. 40% ABV. 750ml.", categoryId: catB.id, brand: "Ron Zacapa", origin: "Guatemala", tags: ["rum","premium"], price: 420.00, stock: 10, featured: false, salesCount: 27, img: IMG.whisky3 },
    { name: "Johnnie Walker Blue Label", slug: "johnnie-walker-blue-label", sku: "BEB-004", shortDescription: "O blend mais exclusivo da Johnnie Walker.", description: "Blend de whiskies raros, alguns com mais de 28 anos. Notas de mel, frutas secas, especiarias e defumado sutil. 40% ABV. 750ml.", categoryId: catB.id, brand: "Johnnie Walker", origin: "Escocia", tags: ["whisky","blend","premium"], price: 1200.00, promoPrice: 1049.90, stock: 7, featured: false, salesCount: 19, img: IMG.whisky1 },

    // Presentes
    { name: "Kit Presente Iniciante Charutos", slug: "kit-presente-iniciante", sku: "KIT-001", shortDescription: "5 charutos + cortador + isqueiro + case de viagem.", description: "Kit completo para iniciantes. 5 charutos de diferentes intensidades, cortador guilhotina, isqueiro jet e case para 5 charutos. Caixa premium.", categoryId: catP.id, brand: "Oeste Tabacaria", origin: "Brasil", tags: ["kit","presente"], price: 599.00, promoPrice: 499.00, stock: 10, featured: true, salesCount: 45, img: IMG.catPresentes },
    { name: "Kit Harmonizacao Charuto & Whisky", slug: "kit-harmonizacao-charuto-whisky", sku: "KIT-002", shortDescription: "2 charutos + Glenfiddich 12 200ml + guia.", description: "2 charutos selecionados, miniatura Glenfiddich 12 (200ml), guia de harmonizacao e 2 tacas Glencairn. Caixa de madeira.", categoryId: catP.id, brand: "Oeste Tabacaria", origin: "Brasil", tags: ["kit","harmonizacao","whisky"], price: 450.00, promoPrice: 389.90, stock: 8, featured: true, salesCount: 33, img: IMG.catPresentes },
    { name: "Kit Premium Executivo", slug: "kit-premium-executivo", sku: "KIT-003", shortDescription: "Humidor de viagem + 3 charutos Cohiba + Dupont.", description: "Humidor de viagem em couro, 3 charutos Cohiba Siglo series, isqueiro S.T. Dupont Maxijet e cortador Xikar Xi2. Caixa lacada.", categoryId: catP.id, brand: "Oeste Tabacaria", origin: "Brasil", tags: ["kit","executivo","premium"], price: 2990.00, stock: 3, featured: true, salesCount: 7, img: IMG.catPresentes },
  ]

  for (const p of products) {
    const { img, ...data } = p
    const prod = await prisma.product.create({ data: data as any })
    await prisma.productImage.create({
      data: { productId: prod.id, url: img, alt: prod.name, isPrimary: true, order: 0 },
    })
  }
  console.log(`${products.length} produtos criados!`)

  // BANNERS
  console.log("Criando banners...")
  await Promise.all([
    prisma.banner.create({ data: { title: "Charutos Cubanos Premium", desktopImage: IMG.banner1, mobileImage: IMG.banner1, link: "/categoria/charutos", position: "HERO", order: 1, active: true } }),
    prisma.banner.create({ data: { title: "Whiskies Single Malt Importados", desktopImage: IMG.banner2, mobileImage: IMG.banner2, link: "/categoria/bebidas", position: "HERO", order: 2, active: true } }),
    prisma.banner.create({ data: { title: "Kits Presente - Surpreenda Quem Voce Ama", desktopImage: IMG.banner3, mobileImage: IMG.banner3, link: "/categoria/presentes", position: "HERO", order: 3, active: true } }),
    prisma.banner.create({ data: { title: "Acessorios e Isqueiros Premium", desktopImage: IMG.banner4, mobileImage: IMG.banner4, link: "/categoria/acessorios", position: "HERO", order: 4, active: true } }),
  ])

  // COUPONS
  console.log("Criando cupons...")
  await Promise.all([
    prisma.coupon.create({ data: { code: "BEMVINDO10", type: "PERCENTAGE", value: 10, minOrder: 100, maxUses: 500, maxUsesPerUser: 1, active: true } }),
    prisma.coupon.create({ data: { code: "CHARUTO20", type: "FIXED", value: 20, minOrder: 200, maxUses: 200, active: true } }),
    prisma.coupon.create({ data: { code: "FRETEGRATIS", type: "FIXED", value: 30, minOrder: 250, maxUses: 100, active: true } }),
    prisma.coupon.create({ data: { code: "PREMIUM15", type: "PERCENTAGE", value: 15, minOrder: 500, maxUses: 50, active: true } }),
  ])

  // STORE SETTINGS
  console.log("Configurando loja...")
  await prisma.storeSettings.create({
    data: {
      storeName: "Oeste Tabacaria", cnpj: "12.345.678/0001-99", phone: "(18) 98817-6442",
      email: "contato@oestetabacaria.com.br",
      address: "Av. Manoel Goulart, 32 - Centro, Presidente Prudente - SP, CEP 19010-270",
      whatsapp: "5518988176442", instagram: "https://instagram.com/oestetabacaria",
      freeShippingMin: 299, fixedShipping: 19.90, enablePickup: true,
      maxInstallments: 12, enablePix: true, enableCard: true, enableBoleto: true,
      ageVerification: true, ageVerificationText: "Voce confirma que tem 18 anos ou mais?",
      metaTitle: "Oeste Tabacaria | Charutos Premium e Head Shop",
      metaDescription: "A melhor tabacaria de Presidente Prudente.",
    },
  })

  // SHIPPING ZONES
  console.log("Criando zonas de frete...")
  await Promise.all([
    prisma.shippingZone.create({ data: { name: "Sao Paulo Capital e Grande SP", states: ["SP"], price: 15.90, minDays: 2, maxDays: 4, active: true } }),
    prisma.shippingZone.create({ data: { name: "Interior de Sao Paulo", states: ["SP"], price: 19.90, minDays: 3, maxDays: 6, active: true } }),
    prisma.shippingZone.create({ data: { name: "Sudeste (MG, RJ, ES)", states: ["MG","RJ","ES"], price: 24.90, minDays: 4, maxDays: 8, active: true } }),
    prisma.shippingZone.create({ data: { name: "Sul (PR, SC, RS)", states: ["PR","SC","RS"], price: 29.90, minDays: 5, maxDays: 9, active: true } }),
    prisma.shippingZone.create({ data: { name: "Nordeste e Centro-Oeste", states: ["BA","SE","AL","PE","PB","RN","CE","PI","MA","MT","MS","GO","DF","TO"], price: 34.90, minDays: 6, maxDays: 12, active: true } }),
    prisma.shippingZone.create({ data: { name: "Norte", states: ["AM","PA","AC","RO","RR","AP"], price: 44.90, minDays: 8, maxDays: 15, active: true } }),
  ])

  // NEWSLETTER
  await Promise.all([
    prisma.newsletter.create({ data: { email: "joao@email.com" } }),
    prisma.newsletter.create({ data: { email: "maria@email.com" } }),
    prisma.newsletter.create({ data: { email: "pedro@email.com" } }),
  ])

  console.log("\nSeed completo!")
  console.log(`${cats.length} categorias, ${products.length} produtos, 4 banners, 4 cupons, 6 zonas de frete`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error("Erro:", e); await prisma.$disconnect(); process.exit(1) })
