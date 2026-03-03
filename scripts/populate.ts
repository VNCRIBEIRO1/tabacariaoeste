import { config } from "dotenv"
config({ path: ".env.local", override: true })

import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwyrt2g1k",
  api_key: process.env.CLOUDINARY_API_KEY || "883982642416381",
  api_secret: process.env.CLOUDINARY_API_SECRET || "wVhAOkz_DAeFoWwnz2xinUBpDeo",
})

const client = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon(client as any)
const prisma = new PrismaClient({ adapter })

// Upload image from URL to Cloudinary
async function uploadToCloudinary(
  imageUrl: string,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `tabacaria/${folder}`,
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    })
    console.log(`  -> Uploaded: ${result.public_id}`)
    return { url: result.secure_url, publicId: result.public_id }
  } catch (err: any) {
    console.error(`  -> Upload failed for ${imageUrl}: ${err.message}`)
    // Return a placeholder
    return {
      url: `https://res.cloudinary.com/dwyrt2g1k/image/upload/v1/tabacaria/${folder}/placeholder`,
      publicId: `tabacaria/${folder}/placeholder`,
    }
  }
}

// Generate a text overlay image using Cloudinary transformations
async function generateBannerImage(
  text: string,
  bgColor: string,
  width: number,
  height: number,
  folder: string,
  id: string
): Promise<{ url: string; publicId: string }> {
  try {
    // Use Cloudinary text overlay on a solid color background
    const url = cloudinary.url("sample", {
      transformation: [
        { width, height, crop: "fill", color: bgColor, effect: "colorize:100" },
        {
          overlay: {
            font_family: "Arial",
            font_size: 60,
            font_weight: "bold",
            text: text.substring(0, 40),
          },
          color: "#FFFFFF",
          gravity: "center",
        },
      ],
      secure: true,
    })
    // Upload this generated URL
    const result = await cloudinary.uploader.upload(url, {
      folder: `tabacaria/${folder}`,
      public_id: id,
      overwrite: true,
    })
    return { url: result.secure_url, publicId: result.public_id }
  } catch (err: any) {
    console.error(`  -> Banner generation failed: ${err.message}`)
    return {
      url: `https://res.cloudinary.com/dwyrt2g1k/image/upload/w_${width},h_${height},c_fill,co_rgb:${bgColor.replace("#", "")},e_colorize:100/sample`,
      publicId: `tabacaria/${folder}/${id}`,
    }
  }
}

// Curated tobacco product images from Unsplash (royalty-free)
const productImages: Record<string, string[]> = {
  charutos: [
    "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=800&q=80",
    "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&q=80",
    "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&q=80",
    "https://images.unsplash.com/photo-1574027057806-b3402cb82969?w=800&q=80",
    "https://images.unsplash.com/photo-1598185788757-b6b415675821?w=800&q=80",
  ],
  acessorios: [
    "https://images.unsplash.com/photo-1527529451874-f9deff87bb9e?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64b35b3?w=800&q=80",
    "https://images.unsplash.com/photo-1543386361-3185e4f52bb3?w=800&q=80",
  ],
  isqueiros: [
    "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=800&q=80",
    "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=800&q=80",
    "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  ],
  bebidas: [
    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80",
    "https://images.unsplash.com/photo-1602767083170-4f73e9dfe3bf?w=800&q=80",
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
    "https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?w=800&q=80",
  ],
  headshop: [
    "https://images.unsplash.com/photo-1560024882-b6fb1fe45556?w=800&q=80",
    "https://images.unsplash.com/photo-1616486029378-1e70a228e5e5?w=800&q=80",
    "https://images.unsplash.com/photo-1585759065152-3b0e2524c3da?w=800&q=80",
  ],
  presentes: [
    "https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=800&q=80",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80",
  ],
}

// Category images
const categoryImages: Record<string, string> = {
  charutos: "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=600&q=80",
  cigarrilhas: "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=600&q=80",
  "tabaco-cachimbo": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&q=80",
  acessorios: "https://images.unsplash.com/photo-1527529451874-f9deff87bb9e?w=600&q=80",
  isqueiros: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=600&q=80",
  "head-shop": "https://images.unsplash.com/photo-1560024882-b6fb1fe45556?w=600&q=80",
  bebidas: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80",
  presentes: "https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=600&q=80",
}

// Comprehensive product catalog
const productsData = [
  // CHARUTOS
  { name: "Charuto Cohiba Robusto", slug: "charuto-cohiba-robusto", sku: "CHR-001", category: "charutos", brand: "Cohiba", origin: "Cuba", price: 189.90, promoPrice: null, stock: 25, description: "O Cohiba Robusto é um dos charutos mais icônicos do mundo. Com medidas de 50 x 124mm, oferece sabores complexos de café, cacau e especiarias, com um final longo e cremoso. Ideal para fumantes experientes que apreciam charutos encorpados.", shortDescription: "Charuto cubano premium com notas de café e cacau", tags: ["premium", "cubano", "encorpado"], featured: true, imgCat: "charutos", imgIdx: 0 },
  { name: "Charuto Montecristo No. 4", slug: "charuto-montecristo-no-4", sku: "CHR-002", category: "charutos", brand: "Montecristo", origin: "Cuba", price: 79.90, promoPrice: 69.90, stock: 40, description: "O Montecristo No.4 é o charuto mais vendido no mundo. Com medidas de 42 x 129mm, formato Petit Corona, oferece um sabor equilibrado com notas de cedro, nozes e um toque de pimenta. Perfeito para uma fumada de 30-40 minutos.", shortDescription: "O charuto mais vendido do mundo - sabor equilibrado", tags: ["clássico", "cubano", "médio"], featured: true, imgCat: "charutos", imgIdx: 1 },
  { name: "Charuto Romeo y Julieta Churchill", slug: "charuto-romeo-y-julieta-churchill", sku: "CHR-003", category: "charutos", brand: "Romeo y Julieta", origin: "Cuba", price: 149.90, promoPrice: 129.90, stock: 15, description: "O Romeo y Julieta Churchill é um clássico absoluto. Nomeado em homenagem a Winston Churchill, este charuto de formato Churchill (47 x 178mm) oferece uma fumada longa e prazerosa com sabores de couro, cedro e terra.", shortDescription: "Charuto clássico formato Churchill - homenagem a Winston Churchill", tags: ["premium", "cubano", "longo"], featured: true, imgCat: "charutos", imgIdx: 2 },
  { name: "Charuto Partagás Serie D No. 4", slug: "charuto-partagas-serie-d-no-4", sku: "CHR-004", category: "charutos", brand: "Partagás", origin: "Cuba", price: 95.90, promoPrice: null, stock: 30, description: "O Partagás Serie D No.4 é um Robusto full-bodied com sabores intensos de terra, couro e cacau. Um dos charutos cubanos mais populares entre fumantes que preferem sabores fortes.", shortDescription: "Robusto cubano full-bodied com sabores intensos", tags: ["forte", "cubano", "encorpado"], featured: false, imgCat: "charutos", imgIdx: 3 },
  { name: "Charuto Arturo Fuente Opus X", slug: "charuto-arturo-fuente-opus-x", sku: "CHR-005", category: "charutos", brand: "Arturo Fuente", origin: "República Dominicana", price: 249.90, promoPrice: null, stock: 10, description: "O Opus X é considerado um dos melhores charutos não-cubanos do mundo. Feito com a lendária capa Rosado, cultivada no Valle del Cibao, oferece sabores complexos de especiarias, café e chocolate amargo.", shortDescription: "Um dos melhores charutos não-cubanos do mundo", tags: ["ultra-premium", "dominicano", "encorpado", "raro"], featured: true, imgCat: "charutos", imgIdx: 4 },
  { name: "Charuto Macanudo Café Hampton Court", slug: "charuto-macanudo-cafe-hampton", sku: "CHR-006", category: "charutos", brand: "Macanudo", origin: "Honduras", price: 39.90, promoPrice: 34.90, stock: 50, description: "O Macanudo Café é perfeito para iniciantes. Com corpo suave e sabores de creme, amêndoas e cedro, oferece uma fumada relaxante e agradável. Formato Corona (45 x 140mm).", shortDescription: "Charuto suave ideal para iniciantes", tags: ["suave", "iniciante", "honduras"], featured: false, imgCat: "charutos", imgIdx: 0 },
  { name: "Charuto H. Upmann Magnum 50", slug: "charuto-h-upmann-magnum-50", sku: "CHR-007", category: "charutos", brand: "H. Upmann", origin: "Cuba", price: 120.00, promoPrice: 99.90, stock: 20, description: "O H. Upmann Magnum 50 é um Robusto Extra com 50 de ring gauge e 160mm de comprimento. Sabores de caramelo, nozes e café, com corpo médio e excelente construção.", shortDescription: "Robusto Extra cubano com notas de caramelo", tags: ["cubano", "medio", "caramelo"], featured: false, imgCat: "charutos", imgIdx: 1 },
  { name: "Charuto Bolivar Belicosos Finos", slug: "charuto-bolivar-belicosos-finos", sku: "CHR-008", category: "charutos", brand: "Bolívar", origin: "Cuba", price: 110.00, promoPrice: null, stock: 18, description: "O Bolívar Belicosos Finos é conhecido por ser um dos charutos mais fortes de Cuba. Formato Belicoso (52 x 140mm) com sabores intensos de terra, couro, pimenta e madeira.", shortDescription: "Um dos charutos mais fortes de Cuba", tags: ["forte", "cubano", "intenso"], featured: false, imgCat: "charutos", imgIdx: 2 },

  // CIGARRILHAS
  { name: "Cigarrilha Dannemann Speciale", slug: "cigarrilha-dannemann-speciale", sku: "CIG-001", category: "cigarrilhas", brand: "Dannemann", origin: "Brasil", price: 22.90, promoPrice: 19.90, stock: 60, description: "A Dannemann Speciale é a cigarrilha brasileira mais famosa. Feita com tabaco Mata Fina da Bahia, oferece sabores suaves de chocolate e madeira. Maço com 10 unidades.", shortDescription: "Cigarrilha brasileira clássica - Maço c/ 10 unidades", tags: ["brasileiro", "suave", "popular"], featured: true, imgCat: "charutos", imgIdx: 3 },
  { name: "Cigarrilha Phillies Titan Natural", slug: "cigarrilha-phillies-titan", sku: "CIG-002", category: "cigarrilhas", brand: "Phillies", origin: "EUA", price: 18.90, promoPrice: null, stock: 80, description: "A Phillies Titan é uma cigarrilha americana popular, de tamanho generoso. Sabor suave e adocicado, ideal para o dia a dia. Pacote com 5 unidades.", shortDescription: "Cigarrilha americana suave - Pacote c/ 5 unidades", tags: ["americano", "suave", "acessivel"], featured: false, imgCat: "charutos", imgIdx: 4 },
  { name: "Cigarrilha Café Crème Arome", slug: "cigarrilha-cafe-creme-arome", sku: "CIG-003", category: "cigarrilhas", brand: "Henri Wintermans", origin: "Holanda", price: 29.90, promoPrice: null, stock: 45, description: "A Café Crème Arome é uma cigarrilha holandesa aromatizada com baunilha. Corpo leve e fumada rápida de 10-15 minutos. Caixa com 10 unidades.", shortDescription: "Cigarrilha holandesa aromatizada com baunilha", tags: ["aromatizado", "baunilha", "leve"], featured: false, imgCat: "charutos", imgIdx: 0 },

  // TABACO PARA CACHIMBO
  { name: "Tabaco Mac Baren Mixture Danish", slug: "tabaco-mac-baren-mixture-danish", sku: "TAB-001", category: "tabaco-cachimbo", brand: "Mac Baren", origin: "Dinamarca", price: 89.90, promoPrice: 79.90, stock: 25, description: "O Mac Baren Mixture Danish é uma mistura clássica dinamarquesa com tabacos Virginia, Burley e Cavendish. Sabor adocicado com notas de baunilha e caramelo. Lata 100g.", shortDescription: "Mistura dinamarquesa clássica - Lata 100g", tags: ["dinamarquês", "adocicado", "cachimbo"], featured: true, imgCat: "charutos", imgIdx: 1 },
  { name: "Tabaco Samuel Gawith Full Virginia Flake", slug: "tabaco-samuel-gawith-virginia", sku: "TAB-002", category: "tabaco-cachimbo", brand: "Samuel Gawith", origin: "Inglaterra", price: 119.90, promoPrice: null, stock: 15, description: "O Full Virginia Flake é um tabaco puro Virginia em formato flake (lascas prensadas). Sabor natural e adocicado, que evolui durante a fumada. Considerado um dos melhores Virginias do mundo. Lata 50g.", shortDescription: "Tabaco puro Virginia Flake inglês premium - Lata 50g", tags: ["inglês", "virginia", "premium", "cachimbo"], featured: false, imgCat: "charutos", imgIdx: 2 },

  // ACESSÓRIOS
  { name: "Cortador de Charutos Xikar Xi2", slug: "cortador-xikar-xi2", sku: "ACE-001", category: "acessorios", brand: "Xikar", origin: "EUA", price: 189.90, promoPrice: 169.90, stock: 15, description: "O Xikar Xi2 é um dos cortadores mais populares do mundo. Design ergonômico com lâminas de aço inoxidável dupla. Corte preciso e suave. Garantia vitalícia.", shortDescription: "Cortador premium com lâminas duplas - Garantia vitalícia", tags: ["cortador", "premium", "xikar"], featured: true, imgCat: "acessorios", imgIdx: 0 },
  { name: "Umidificador para Humidor Boveda 69%", slug: "umidificador-boveda-69", sku: "ACE-002", category: "acessorios", brand: "Boveda", origin: "EUA", price: 29.90, promoPrice: null, stock: 100, description: "O Boveda 69% é o sistema de umidificação bidirecional mais utilizado no mundo. Mantém a umidade ideal de 69% automaticamente. Substitua a cada 2-3 meses. Pacote individual.", shortDescription: "Umidificação bidirecional automática 69% - Pacote individual", tags: ["umidificador", "boveda", "humidor"], featured: false, imgCat: "acessorios", imgIdx: 1 },
  { name: "Humidor em Cedro para 50 Charutos", slug: "humidor-cedro-50-charutos", sku: "ACE-003", category: "acessorios", brand: "Oeste Selection", origin: "Brasil", price: 399.90, promoPrice: 349.90, stock: 8, description: "Humidor artesanal em madeira de cedro espanhol, com capacidade para até 50 charutos. Interior em cedro para preservação ideal dos aromas. Inclui higrômetro analógico e umidificador.", shortDescription: "Humidor artesanal em cedro - Capacidade 50 charutos", tags: ["humidor", "cedro", "armazenamento", "premium"], featured: true, imgCat: "acessorios", imgIdx: 2 },
  { name: "Cinzeiro Outdoor Resistente ao Vento", slug: "cinzeiro-outdoor-resistente", sku: "ACE-004", category: "acessorios", brand: "Oeste Selection", origin: "China", price: 59.90, promoPrice: 49.90, stock: 30, description: "Cinzeiro de aço inoxidável com design resistente ao vento. Ideal para uso externo. Comporta até 4 charutos simultaneamente. Base antiderrapante.", shortDescription: "Cinzeiro em aço inox para 4 charutos - Uso externo", tags: ["cinzeiro", "outdoor", "aço-inox"], featured: false, imgCat: "acessorios", imgIdx: 3 },

  // ISQUEIROS
  { name: "Isqueiro S.T. Dupont MaxiJet", slug: "isqueiro-st-dupont-maxijet", sku: "ISQ-001", category: "isqueiros", brand: "S.T. Dupont", origin: "França", price: 499.90, promoPrice: 449.90, stock: 5, description: "O S.T. Dupont MaxiJet é um isqueiro de luxo com chama turbo resistente ao vento. Corpo em laca preta com acabamento cromado. Perfeito para charutos.", shortDescription: "Isqueiro de luxo francês com chama turbo", tags: ["luxo", "turbo", "charuto", "dupont"], featured: true, imgCat: "isqueiros", imgIdx: 0 },
  { name: "Isqueiro Xikar Allume Double Jet", slug: "isqueiro-xikar-allume-double", sku: "ISQ-002", category: "isqueiros", brand: "Xikar", origin: "EUA", price: 159.90, promoPrice: null, stock: 20, description: "O Xikar Allume possui chama dupla turbo para acendimento rápido e uniforme de charutos. Corpo em plástico resistente com visor de combustível. Garantia vitalícia.", shortDescription: "Chama dupla turbo - Garantia vitalícia", tags: ["turbo", "dupla-chama", "xikar"], featured: false, imgCat: "isqueiros", imgIdx: 1 },
  { name: "Isqueiro Clipper Classic Coleção", slug: "isqueiro-clipper-classic", sku: "ISQ-003", category: "isqueiros", brand: "Clipper", origin: "Espanha", price: 12.90, promoPrice: 9.90, stock: 200, description: "Isqueiro Clipper Classic recarregável com designs exclusivos. O isqueiro mais sustentável do mercado - 100% reciclável e reabastecível. Pederneira removível.", shortDescription: "Isqueiro recarregável sustentável - Designs exclusivos", tags: ["clipper", "recarregável", "sustentável", "acessível"], featured: false, imgCat: "isqueiros", imgIdx: 2 },

  // HEAD SHOP
  { name: "Dichavador de Ervas em Metal 4 Partes", slug: "dichavador-metal-4-partes", sku: "HDS-001", category: "head-shop", brand: "Oeste Selection", origin: "China", price: 39.90, promoPrice: 29.90, stock: 45, description: "Dichavador (triturador de ervas) em liga de zinco com 4 partes e tela coletora de pólen. Diâmetro 50mm. Dentes de losango para trituração eficiente.", shortDescription: "Dichavador em metal com tela coletora - 50mm", tags: ["dichavador", "metal", "ervas"], featured: false, imgCat: "headshop", imgIdx: 0 },
  { name: "Seda RAW Classic King Size", slug: "seda-raw-classic-king-size", sku: "HDS-002", category: "head-shop", brand: "RAW", origin: "Espanha", price: 8.90, promoPrice: null, stock: 150, description: "A RAW Classic é feita de fibra de cânhamo e linho naturais, sem branqueamento. Formato King Size (110mm). Pacote com 32 folhas. A seda mais vendida do mundo.", shortDescription: "Seda natural de cânhamo - 32 folhas King Size", tags: ["seda", "raw", "natural", "king-size"], featured: true, imgCat: "headshop", imgIdx: 1 },
  { name: "Piteira de Vidro Artesanal 8mm", slug: "piteira-vidro-artesanal-8mm", sku: "HDS-003", category: "head-shop", brand: "Oeste Selection", origin: "Brasil", price: 15.90, promoPrice: null, stock: 60, description: "Piteira artesanal em vidro borossilicato (pyrex) resistente ao calor. Diâmetro de 8mm. Fácil limpeza e reutilizável. Diversas cores disponíveis.", shortDescription: "Piteira de vidro pyrex reutilizável - 8mm", tags: ["piteira", "vidro", "reutilizável"], featured: false, imgCat: "headshop", imgIdx: 2 },

  // BEBIDAS
  { name: "Whisky Glenfiddich 12 Anos", slug: "whisky-glenfiddich-12-anos", sku: "BEB-001", category: "bebidas", brand: "Glenfiddich", origin: "Escócia", price: 279.90, promoPrice: 249.90, stock: 12, description: "O Glenfiddich 12 é um single malt escocês envelhecido por 12 anos em barris de carvalho americano e europeu. Sabores frutados de pera e malte, com final suave. 750ml.", shortDescription: "Single Malt escocês 12 anos - 750ml", tags: ["whisky", "single-malt", "escocês", "12-anos"], featured: true, imgCat: "bebidas", imgIdx: 0 },
  { name: "Rum Zacapa 23 Centenario", slug: "rum-zacapa-23-centenario", sku: "BEB-002", category: "bebidas", brand: "Ron Zacapa", origin: "Guatemala", price: 349.90, promoPrice: null, stock: 8, description: "O Zacapa 23 é envelhecido pelo sistema Solera com uma mescla de rums entre 6 e 23 anos. Sabores de caramelo, baunilha, chocolate e frutas secas. Perfeito para harmonizar com charutos. 750ml.", shortDescription: "Rum guatemalteco premium Sistema Solera - 750ml", tags: ["rum", "premium", "guatemala", "solera"], featured: true, imgCat: "bebidas", imgIdx: 1 },
  { name: "Conhaque Hennessy V.S.", slug: "conhaque-hennessy-vs", sku: "BEB-003", category: "bebidas", brand: "Hennessy", origin: "França", price: 219.90, promoPrice: 199.90, stock: 10, description: "O Hennessy V.S. (Very Special) é um cognac francês envelhecido por pelo menos 2 anos. Notas de baunilha, carvalho e frutas frescas. Harmoniza perfeitamente com charutos de corpo médio. 700ml.", shortDescription: "Cognac francês V.S. clássico - 700ml", tags: ["conhaque", "cognac", "francês", "hennessy"], featured: false, imgCat: "bebidas", imgIdx: 2 },
  { name: "Cerveja Belgian Tripel Artesanal", slug: "cerveja-belgian-tripel-artesanal", sku: "BEB-004", category: "bebidas", brand: "Oeste Brew", origin: "Brasil", price: 24.90, promoPrice: 19.90, stock: 48, description: "Belgian Tripel artesanal com 9% ABV. Sabores de banana, cravo e mel, com final seco e refrescante. Garrafa 500ml. Produzida em Presidente Prudente.", shortDescription: "Belgian Tripel artesanal local - 500ml", tags: ["cerveja", "artesanal", "belgian", "tripel"], featured: false, imgCat: "bebidas", imgIdx: 3 },

  // PRESENTES
  { name: "Kit Premium Charuto + Isqueiro + Cortador", slug: "kit-premium-charuto-isqueiro-cortador", sku: "PRE-001", category: "presentes", brand: "Oeste Selection", origin: "Variado", price: 299.90, promoPrice: 259.90, stock: 12, description: "Kit presente premium contendo 1 Charuto Montecristo No.4, 1 Isqueiro Xikar e 1 Cortador Xikar Xi2 em caixa de apresentação exclusiva. Presente ideal para aficionados.", shortDescription: "Kit charuto + isqueiro + cortador em caixa presente", tags: ["kit", "presente", "premium"], featured: true, imgCat: "presentes", imgIdx: 0 },
  { name: "Kit Degustação 5 Charutos Variados", slug: "kit-degustacao-5-charutos", sku: "PRE-002", category: "presentes", brand: "Oeste Selection", origin: "Variado", price: 199.90, promoPrice: null, stock: 20, description: "Kit com 5 charutos selecionados de diferentes marcas e origens para uma experiência de degustação completa. Inclui Montecristo, Romeo y Julieta, Partagás, Macanudo e Arturo Fuente.", shortDescription: "5 charutos selecionados de diferentes marcas", tags: ["kit", "degustação", "variado"], featured: false, imgCat: "presentes", imgIdx: 1 },
]

// Categories data
const categoriesData = [
  { name: "Charutos", slug: "charutos", icon: "🏆", description: "Os melhores charutos cubanos e de todo o mundo. Premium, clássicos e para iniciantes.", order: 1 },
  { name: "Cigarrilhas", slug: "cigarrilhas", icon: "🚬", description: "Cigarrilhas de diversas origens e sabores para todos os gostos.", order: 2 },
  { name: "Tabaco para Cachimbo", slug: "tabaco-cachimbo", icon: "🪈", description: "Tabacos premium para cachimbo de diversas marcas e misturas.", order: 3 },
  { name: "Acessórios", slug: "acessorios", icon: "✂️", description: "Cortadores, humidors, cinzeiros e tudo para o aficionado.", order: 4 },
  { name: "Isqueiros", slug: "isqueiros", icon: "🔥", description: "Isqueiros de alta qualidade para charutos e uso diário.", order: 5 },
  { name: "Head Shop", slug: "head-shop", icon: "🌿", description: "Sedas, piteiras, dichavadores e acessórios para fumo.", order: 6 },
  { name: "Bebidas", slug: "bebidas", icon: "🥃", description: "Whiskies, rums, conhaques e cervejas artesanais para harmonizar.", order: 7 },
  { name: "Presentes", slug: "presentes", icon: "🎁", description: "Kits especiais e caixas presente para quem você ama.", order: 8 },
]

async function main() {
  console.log("=== POPULATING OESTE TABACARIA ===\n")

  // 1. Clean existing data
  console.log("1. Cleaning existing data...")
  await prisma.orderItem.deleteMany()
  await prisma.orderStatusHistory.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.shippingZone.deleteMany()
  await prisma.storeSettings.deleteMany()
  console.log("  Done!\n")

  // 2. Create admin user
  console.log("2. Creating admin user...")
  const hashedPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@oestetabacaria.com.br" },
    update: { password: hashedPassword },
    create: {
      name: "Administrador",
      email: "admin@oestetabacaria.com.br",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "(18) 98817-6442",
    },
  })
  console.log("  Admin: admin@oestetabacaria.com.br / admin123\n")

  // 3. Create categories with Cloudinary images
  console.log("3. Creating categories with images...")
  const categoryMap: Record<string, string> = {}
  for (const cat of categoriesData) {
    console.log(`  Category: ${cat.name}`)
    let imageUrl: string | null = null
    const srcUrl = categoryImages[cat.slug]
    if (srcUrl) {
      const uploaded = await uploadToCloudinary(srcUrl, "categories", cat.slug)
      imageUrl = uploaded.url
    }
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: imageUrl,
        order: cat.order,
        active: true,
      },
    })
    categoryMap[cat.slug] = created.id
  }
  console.log(`  Created ${categoriesData.length} categories\n`)

  // 4. Create products with Cloudinary images
  console.log("4. Creating products with images...")
  for (const prod of productsData) {
    console.log(`  Product: ${prod.name}`)
    const catId = categoryMap[prod.category]
    const images = productImages[prod.imgCat] || productImages.charutos
    const imgUrl = images[prod.imgIdx % images.length]

    const uploaded = await uploadToCloudinary(imgUrl, "products", prod.slug)

    const product = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        shortDescription: prod.shortDescription,
        description: prod.description,
        categoryId: catId || null,
        brand: prod.brand,
        origin: prod.origin,
        tags: prod.tags,
        price: prod.price,
        promoPrice: prod.promoPrice,
        stock: prod.stock,
        minStock: 3,
        active: true,
        featured: prod.featured,
        metaTitle: `${prod.name} | Oeste Tabacaria`,
        metaDescription: prod.shortDescription || "",
      },
    })

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt: prod.name,
        order: 0,
        isPrimary: true,
      },
    })
  }
  console.log(`  Created ${productsData.length} products\n`)

  // 5. Create banners
  console.log("5. Creating banners...")
  const bannerConfigs = [
    {
      title: "Charutos Premium - Os Melhores do Mundo",
      link: "/categoria/charutos",
      imgUrl: "https://images.unsplash.com/photo-1589988258720-a03b85055dfa?w=1400&h=600&q=80&fit=crop",
    },
    {
      title: "Frete Grátis acima de R$ 299",
      link: "/busca?sort=bestseller",
      imgUrl: "https://images.unsplash.com/photo-1574027057806-b3402cb82969?w=1400&h=600&q=80&fit=crop",
    },
    {
      title: "Kits Presente - Surpreenda quem você ama",
      link: "/categoria/presentes",
      imgUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=1400&h=600&q=80&fit=crop",
    },
  ]

  for (let i = 0; i < bannerConfigs.length; i++) {
    const b = bannerConfigs[i]
    console.log(`  Banner: ${b.title}`)
    const uploaded = await uploadToCloudinary(b.imgUrl, "banners", `hero-${i + 1}`)
    await prisma.banner.create({
      data: {
        title: b.title,
        desktopImage: uploaded.url,
        mobileImage: uploaded.url,
        link: b.link,
        position: "HERO",
        order: i,
        active: true,
      },
    })
  }
  console.log(`  Created ${bannerConfigs.length} banners\n`)

  // 6. Create coupons
  console.log("6. Creating coupons...")
  await prisma.coupon.createMany({
    data: [
      {
        code: "BEMVINDO10",
        type: "PERCENTAGE",
        value: 10,
        minOrder: 50,
        maxUses: 500,
        active: true,
      },
      {
        code: "CHARUTO20",
        type: "FIXED",
        value: 20,
        minOrder: 100,
        maxUses: 100,
        active: true,
      },
      {
        code: "FRETE0",
        type: "FIXED",
        value: 30,
        minOrder: 150,
        maxUses: 200,
        active: true,
      },
    ],
  })
  console.log("  Created 3 coupons\n")

  // 7. Store settings
  console.log("7. Creating store settings...")
  await prisma.storeSettings.create({
    data: {
      storeName: "Oeste Tabacaria",
      cnpj: "12.345.678/0001-90",
      phone: "(18) 98817-6442",
      email: "contato@oestetabacaria.com.br",
      address: "Av. Manoel Goulart, 32 - Centro, Pres. Prudente - SP, 19010-270",
      whatsapp: "5518988176442",
      instagram: "https://instagram.com/oestetabacaria",
      facebook: "https://facebook.com/oestetabacaria",
      freeShippingMin: 299,
      fixedShipping: 19.90,
      enablePickup: true,
      maxInstallments: 12,
      enablePix: true,
      enableCard: true,
      enableBoleto: true,
      emailFrom: "noreply@oestetabacaria.com.br",
      metaTitle: "Oeste Tabacaria | Charutos, Acessórios e Head Shop em Presidente Prudente",
      metaDescription: "A melhor tabacaria de Presidente Prudente. Charutos, cigarrilhas, acessórios, isqueiros, head shop e muito mais.",
      ageVerification: true,
      ageVerificationText: "Este site contém produtos derivados do tabaco destinados exclusivamente a maiores de 18 anos. A venda de produtos derivados do tabaco é proibida para menores de 18 anos — Lei 8.069/1990.",
    },
  })
  console.log("  Done!\n")

  // 8. Shipping zones
  console.log("8. Creating shipping zones...")
  await prisma.shippingZone.createMany({
    data: [
      { name: "São Paulo (Capital e Interior)", states: ["SP"], price: 14.90, minDays: 2, maxDays: 5 },
      { name: "Sudeste", states: ["RJ", "MG", "ES"], price: 19.90, minDays: 3, maxDays: 7 },
      { name: "Sul", states: ["PR", "SC", "RS"], price: 22.90, minDays: 4, maxDays: 8 },
      { name: "Centro-Oeste", states: ["GO", "MT", "MS", "DF"], price: 24.90, minDays: 5, maxDays: 10 },
      { name: "Nordeste", states: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"], price: 29.90, minDays: 6, maxDays: 12 },
      { name: "Norte", states: ["PA", "AM", "AP", "RR", "RO", "AC", "TO"], price: 34.90, minDays: 7, maxDays: 15 },
    ],
  })
  console.log("  Created 6 shipping zones\n")

  // 9. Newsletter seed
  console.log("9. Seeding newsletter...")
  await prisma.newsletter.createMany({
    data: [
      { email: "joao@email.com" },
      { email: "maria@email.com" },
      { email: "carlos@email.com" },
    ],
  })
  console.log("  Done!\n")

  console.log("=== POPULATION COMPLETE ===")
  console.log(`Total: ${categoriesData.length} categories, ${productsData.length} products, ${bannerConfigs.length} banners`)
  console.log("Admin: admin@oestetabacaria.com.br / admin123")
  console.log("Coupons: BEMVINDO10 (10%), CHARUTO20 (R$20 off), FRETE0 (R$30 off)")
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error("SEED ERROR:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
