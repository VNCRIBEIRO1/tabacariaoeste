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

// Category images (Unsplash)
const CAT_IMG = {
  sedas: "https://images.unsplash.com/photo-1616712134411-6b6ae89bc3ba?w=600&h=600&fit=crop",
  bongs: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=600&h=600&fit=crop",
  pipes: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=600&fit=crop",
  narguile: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=600&fit=crop",
  essencias: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
}

// Banner images
const BANNER_IMG = {
  b1: "https://images.unsplash.com/photo-1616712134411-6b6ae89bc3ba?w=1400&h=550&fit=crop",
  b2: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=1400&h=550&fit=crop",
  b3: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1400&h=550&fit=crop",
  b4: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1400&h=550&fit=crop",
}

function slugify(str: string): string {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
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
    prisma.category.create({ data: { name: "Sedas", slug: "sedas", icon: "📜", description: "Sedas, piteiras e cones das melhores marcas: OCB, Smoking, Raw, Bem Bolado e mais.", image: CAT_IMG.sedas, order: 1, active: true } }),
    prisma.category.create({ data: { name: "Bongs", slug: "bongs", icon: "🫧", description: "Bongs de vidro, resina e silicone. Acessorios como bowls, downstems e quartz bangers.", image: CAT_IMG.bongs, order: 2, active: true } }),
    prisma.category.create({ data: { name: "Pipes", slug: "pipes", icon: "🔥", description: "Pipes de vidro, metal, madeira e silicone. Kits e acessorios para limpeza.", image: CAT_IMG.pipes, order: 3, active: true } }),
    prisma.category.create({ data: { name: "Narguile", slug: "narguile", icon: "💨", description: "Carvoes, mangueiras, roshs, essencias e acessorios para narguile.", image: CAT_IMG.narguile, order: 4, active: true } }),
    prisma.category.create({ data: { name: "Essencias", slug: "essencias", icon: "🍇", description: "Essencias Ziggy em diversos sabores para narguile.", image: CAT_IMG.essencias, order: 5, active: true } }),
  ])
  const [catSedas, catBongs, catPipes, catNarguile, catEssencias] = cats

  // PRODUCTS — from JSON data with real images from tabacariadamata.com.br
  console.log("Criando produtos...")
  const products = [
    // === SEDAS (12 produtos) ===
    { name: "Seda Lion Rolling Circus Morango 1 1/4", sku: "SED-001", shortDescription: "Seda saborizada de morango Lion Rolling Circus.", description: "Seda de alta qualidade com sabor morango. Tamanho 1 1/4, queima lenta e uniforme. Ideal para quem busca uma experiencia aromatica.", categoryId: catSedas.id, brand: "Lion Rolling Circus", tags: ["seda","saborizada","morango"], price: 12.90, stock: 100, featured: true, salesCount: 85, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-lion-rolling-circus-morango.jpg" },
    { name: "Seda Gizeh Extra Fine King Size Slim", sku: "SED-002", shortDescription: "Ultra fina para queima lenta e sabor puro.", description: "Seda Gizeh Extra Fine em tamanho King Size Slim. Papel ultrafino que garante queima lenta e preserva o sabor. Fabricacao alema de alta qualidade.", categoryId: catSedas.id, brand: "Gizeh", tags: ["seda","king-size","slim"], price: 8.00, stock: 150, featured: true, salesCount: 120, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-gizeh-extra-fine.jpg" },
    { name: "Seda Bem Bolado Brown King Size Large", sku: "SED-003", shortDescription: "Seda marrom natural sem branqueamento.", description: "Seda Bem Bolado Brown feita com papel nao branqueado. King Size Large para maior aproveitamento. Queima uniforme, preco acessivel.", categoryId: catSedas.id, brand: "Bem Bolado", tags: ["seda","brown","natural"], price: 4.50, stock: 200, featured: false, salesCount: 180, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-bem-bolado-brown.jpg" },
    { name: "Seda Bem Bolado King Size Extra Large", sku: "SED-004", shortDescription: "Extra large para maior rendimento.", description: "Seda Bem Bolado King Size Extra Large. Tamanho generoso para maior rendimento. Papel de alta qualidade com queima lenta.", categoryId: catSedas.id, brand: "Bem Bolado", tags: ["seda","extra-large"], price: 3.50, stock: 250, featured: false, salesCount: 210, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-bem-bolado-extra-large.jpg" },
    { name: "Seda Smoking Master King Size", sku: "SED-005", shortDescription: "Ultrafina espanhola de alta qualidade.", description: "Seda Smoking Master King Size. Fabricacao espanhola com papel ultrafino. Transparencia que garante queima lenta e sabor puro.", categoryId: catSedas.id, brand: "Smoking", tags: ["seda","ultrafina","master"], price: 7.90, stock: 120, featured: true, salesCount: 95, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-smoking-master.jpg" },
    { name: "Seda Smoking Brown King Size", sku: "SED-006", shortDescription: "Seda marrom natural Smoking.", description: "Seda Smoking Brown King Size. Papel nao branqueado, 100% natural. Queima lenta e uniforme com acabamento premium.", categoryId: catSedas.id, brand: "Smoking", tags: ["seda","brown","natural"], price: 9.00, stock: 90, featured: false, salesCount: 78, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-smoking-brown.jpg" },
    { name: "Seda Smoking Deluxe c/ Piteira King Size", sku: "SED-007", shortDescription: "Seda premium com piteira inclusa.", description: "Seda Smoking Deluxe King Size acompanhada de piteiras de papel. Papel ultrafino de fibra de linho. Kit completo e pratico.", categoryId: catSedas.id, brand: "Smoking", tags: ["seda","deluxe","piteira"], price: 18.90, promoPrice: 15.90, stock: 60, featured: true, salesCount: 65, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-smoking-deluxe.jpg" },
    { name: "Seda OCB Ultimate King Size", sku: "SED-008", shortDescription: "A seda mais fina da OCB.", description: "Seda OCB Ultimate King Size. A mais fina da linha OCB, quase transparente. Fabricacao francesa com fibras de linho. Queima lenta e limpa.", categoryId: catSedas.id, brand: "OCB", tags: ["seda","ultrafina","ocb"], price: 7.00, stock: 130, featured: true, salesCount: 110, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-ocb-ultimate.jpg" },
    { name: "Seda The Bulldog Blue King Size", sku: "SED-009", shortDescription: "Seda classica da marca holandesa The Bulldog.", description: "Seda The Bulldog Blue King Size. Marca iconica de Amsterdam. Papel de alta qualidade, queima uniforme. Embalagem classica azul.", categoryId: catSedas.id, brand: "The Bulldog", tags: ["seda","holandesa"], price: 6.00, stock: 140, featured: false, salesCount: 92, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/seda-bulldog-blue.jpg" },
    { name: "Piteira Papelito Crush Selvagem", sku: "SED-010", shortDescription: "Piteira com capsula aromatica crush.", description: "Piteira Papelito com capsula crush para liberar aroma. Sabor selvagem intenso. Compativel com qualquer seda. Embalagem com 6 unidades.", categoryId: catSedas.id, brand: "Papelito", tags: ["piteira","crush","aromatica"], price: 13.90, stock: 80, featured: false, salesCount: 55, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/piteira-papelito-crush.jpg" },
    { name: "Cone Smoking Brown Gigasize", sku: "SED-011", shortDescription: "Cone pre-enrolado gigante Smoking Brown.", description: "Cone Smoking Brown Gigasize pre-enrolado. Tamanho gigante para ocasioes especiais. Papel marrom natural nao branqueado.", categoryId: catSedas.id, brand: "Smoking", tags: ["cone","gigante","brown"], price: 126.90, promoPrice: 109.90, stock: 15, featured: true, salesCount: 18, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/cone-smoking-brown.jpg" },
    { name: "Piteira de Vidro Da Mata Anti-Stress 6mm", sku: "SED-012", shortDescription: "Piteira de vidro reutilizavel com textura anti-stress.", description: "Piteira de vidro borossilicato 6mm com textura anti-stress para maior aderencia. Reutilizavel, facil de limpar. Producao artesanal Da Mata.", categoryId: catSedas.id, brand: "Da Mata", tags: ["piteira","vidro","reutilizavel"], price: 30.90, stock: 50, featured: false, salesCount: 42, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/piteira-vidro-anti-stress.jpg" },

    // === BONGS (12 produtos) ===
    { name: "Bong Erotico de Vidro", sku: "BNG-001", shortDescription: "Bong de vidro com design erotico exclusivo.", description: "Bong de vidro borossilicato com design erotico unico. Peca artesanal, resistente e funcional. Altura aproximada 20cm.", categoryId: catBongs.id, brand: "Artesanal", tags: ["bong","vidro","erotico"], price: 125.90, stock: 10, featured: true, salesCount: 25, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/bong-erotico-vidro.jpg" },
    { name: "Bong Da Mata Erva Pampas", sku: "BNG-002", shortDescription: "Bong premium Da Mata com design exclusivo Pampas.", description: "Bong de vidro borossilicato Da Mata linha Erva Pampas. Design exclusivo com detalhes artesanais. Percolador integrado para filtragem suave.", categoryId: catBongs.id, brand: "Da Mata", tags: ["bong","premium","pampas"], price: 195.90, promoPrice: 169.90, stock: 8, featured: true, salesCount: 15, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/bong-da-mata-pampas.jpg" },
    { name: "Bong de Vidro Mr. Da Mata - Cambuca", sku: "BNG-003", shortDescription: "Bong da linha Mr. Da Mata modelo Cambuca.", description: "Bong de vidro Mr. Da Mata Cambuca. Design compacto e funcional. Vidro borossilicato resistente. Ideal para uso diario.", categoryId: catBongs.id, brand: "Da Mata", tags: ["bong","vidro","compacto"], price: 89.90, stock: 20, featured: false, salesCount: 35, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/bong-mr-cambuca.jpg" },
    { name: "Bong de Vidro Mr. Da Mata Amazonia", sku: "BNG-004", shortDescription: "Bong da linha Mr. Da Mata modelo Amazonia.", description: "Bong de vidro Mr. Da Mata Amazonia. Design inspirado na floresta amazonica. Vidro borossilicato espesso e resistente.", categoryId: catBongs.id, brand: "Da Mata", tags: ["bong","vidro","amazonia"], price: 81.90, stock: 18, featured: false, salesCount: 28, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/bong-mr-amazonia.jpg" },
    { name: "Bong de Vidro Erotico Pequeno", sku: "BNG-005", shortDescription: "Versao compacta do bong erotico.", description: "Bong de vidro erotico em tamanho compacto. Vidro borossilicato artesanal. Facil de transportar e armazenar.", categoryId: catBongs.id, brand: "Artesanal", tags: ["bong","vidro","compacto"], price: 105.90, stock: 12, featured: false, salesCount: 20, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/bong-erotico-pequeno.jpg" },
    { name: "Bong de Resina White Skull", sku: "BNG-006", shortDescription: "Bong de resina formato caveira branca.", description: "Bong de resina de alta qualidade com formato de caveira branca. Peca decorativa e funcional. Detalhes esculpidos a mao. Resistente e duravel.", categoryId: catBongs.id, brand: "Artesanal", tags: ["bong","resina","caveira"], price: 279.90, promoPrice: 239.90, stock: 5, featured: true, salesCount: 12, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/bong-resina-skull.jpg" },
    { name: "Glass Bowl Colors Squadafum 14mm Male", sku: "BNG-007", shortDescription: "Bowl colorido Squadafum para bong 14mm.", description: "Glass Bowl Colors Squadafum encaixe 14mm macho. Vidro borossilicato colorido. Varias cores disponiveis. Compativel com a maioria dos bongs.", categoryId: catBongs.id, brand: "Squadafum", tags: ["bowl","14mm","colorido"], price: 90.99, stock: 30, featured: false, salesCount: 45, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/glass-bowl-colors-squadafum.jpg" },
    { name: "Glass Bowl High Colors Squadafum 14mm Male", sku: "BNG-008", shortDescription: "Bowl alto colorido Squadafum 14mm.", description: "Glass Bowl High Colors Squadafum 14mm macho. Modelo mais alto para maior capacidade. Cores vibrantes em vidro borossilicato.", categoryId: catBongs.id, brand: "Squadafum", tags: ["bowl","14mm","alto"], price: 98.50, stock: 25, featured: false, salesCount: 38, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/glass-bowl-high-colors.jpg" },
    { name: "Glass Bowl Squadafum 14mm Macho", sku: "BNG-009", shortDescription: "Bowl classico Squadafum 14mm transparente.", description: "Glass Bowl Squadafum 14mm macho em vidro transparente. Design classico e funcional. Vidro borossilicato de alta qualidade.", categoryId: catBongs.id, brand: "Squadafum", tags: ["bowl","14mm","classico"], price: 75.99, stock: 35, featured: false, salesCount: 52, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/glass-bowl-macho.jpg" },
    { name: "Downstem Squadafum 14mm", sku: "BNG-010", shortDescription: "Downstem difusor Squadafum 14mm.", description: "Downstem Squadafum 14mm com difusor na ponta. Vidro borossilicato. Melhora a filtragem e suavidade da tragada.", categoryId: catBongs.id, brand: "Squadafum", tags: ["downstem","14mm","difusor"], price: 32.90, stock: 40, featured: false, salesCount: 60, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/downstem-squadafum.jpg" },
    { name: "Quartz Banger Squadafum S/ Insert Femea 14mm", sku: "BNG-011", shortDescription: "Banger de quartzo Squadafum 14mm femea.", description: "Quartz Banger Squadafum sem insert, encaixe femea 14mm. Quartzo de alta qualidade para dabs. Retencao termica superior.", categoryId: catBongs.id, brand: "Squadafum", tags: ["banger","quartzo","14mm"], price: 145.00, stock: 15, featured: false, salesCount: 22, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/quartz-banger-squadafum.jpg" },
    { name: "SDF Quartz Banger c/ Insert 14mm Macho", sku: "BNG-012", shortDescription: "Banger de quartzo SDF com insert 14mm.", description: "SDF Quartz Banger com insert incluso, encaixe macho 14mm. Quartzo premium para melhor retencao de calor. Ideal para concentrados.", categoryId: catBongs.id, brand: "Squadafum", tags: ["banger","quartzo","insert"], price: 152.90, promoPrice: 134.90, stock: 10, featured: true, salesCount: 18, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/sdf-quartz-banger.jpg" },

    // === PIPES (12 produtos) ===
    { name: "Cachimbo Pipe Raw", sku: "PIP-001", shortDescription: "Cachimbo oficial da marca Raw.", description: "Cachimbo Pipe Raw em madeira natural. Design classico da marca Raw. Acabamento premium, bowl generoso. Para uso com tabaco ou ervas.", categoryId: catPipes.id, brand: "Raw", tags: ["cachimbo","madeira","raw"], price: 350.00, promoPrice: 299.90, stock: 5, featured: true, salesCount: 15, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/cachimbo-pipe-raw.jpg" },
    { name: "Pipe de Vidro c/ Liquido Colorido", sku: "PIP-002", shortDescription: "Pipe de vidro com liquido decorativo.", description: "Pipe de vidro com liquido colorido interno decorativo. Design exclusivo e chamativo. Vidro borossilicato resistente.", categoryId: catPipes.id, brand: "Artesanal", tags: ["pipe","vidro","colorido"], price: 38.90, stock: 25, featured: false, salesCount: 48, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-vidro-liquido.jpg" },
    { name: "Rede Metalica c/ 05 unidades", sku: "PIP-003", shortDescription: "Pack com 5 redes metalicas para pipe.", description: "Rede metalica para pipe com 5 unidades. Acessorio essencial para filtragem. Aco inoxidavel. Compativel com a maioria dos pipes.", categoryId: catPipes.id, brand: "Generico", tags: ["rede","metalica","acessorio"], price: 6.00, stock: 300, featured: false, salesCount: 220, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/rede-metalica.jpg" },
    { name: "Pipe Cleaners Raw", sku: "PIP-004", shortDescription: "Limpadores de pipe da marca Raw.", description: "Pipe Cleaners Raw para limpeza de pipes e cachimbos. Hastes flexiveis com cerdas absorventes. Embalagem com 50 unidades.", categoryId: catPipes.id, brand: "Raw", tags: ["limpeza","pipe","raw"], price: 14.90, stock: 80, featured: false, salesCount: 95, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-cleaners-raw.jpg" },
    { name: "Kit Pipe de Metal Squadafum 5 un - ROSA", sku: "PIP-005", shortDescription: "Kit com 5 pipes de metal rosa Squadafum.", description: "Kit com 5 pipes de metal Squadafum na cor rosa. Tamanhos variados. Metal de alta qualidade com acabamento anodizado.", categoryId: catPipes.id, brand: "Squadafum", tags: ["kit","pipe","metal","rosa"], price: 179.90, promoPrice: 159.90, stock: 10, featured: true, salesCount: 22, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/kit-pipe-metal-rosa.jpg" },
    { name: "Kit Pipe de Metal Squadafum 5 un - Laranja", sku: "PIP-006", shortDescription: "Kit com 5 pipes de metal laranja Squadafum.", description: "Kit com 5 pipes de metal Squadafum na cor laranja. Tamanhos variados. Metal de alta qualidade com acabamento anodizado.", categoryId: catPipes.id, brand: "Squadafum", tags: ["kit","pipe","metal","laranja"], price: 179.90, promoPrice: 159.90, stock: 10, featured: true, salesCount: 20, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/kit-pipe-metal-laranja.jpg" },
    { name: "Pipe de Vidro Reto", sku: "PIP-007", shortDescription: "Pipe de vidro formato reto classico.", description: "Pipe de vidro reto em borossilicato transparente. Design simples e funcional. Facil de limpar. Tamanho compacto.", categoryId: catPipes.id, brand: "Artesanal", tags: ["pipe","vidro","reto"], price: 25.00, stock: 40, featured: false, salesCount: 58, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-vidro-reto.jpg" },
    { name: "Pipe de Silicone V de Vinganca", sku: "PIP-008", shortDescription: "Pipe de silicone com design V de Vinganca.", description: "Pipe de silicone com design da mascara V de Vinganca. Inquebravel, facil de limpar. Silicone alimenticio de alta qualidade.", categoryId: catPipes.id, brand: "Artesanal", tags: ["pipe","silicone","design"], price: 45.00, stock: 20, featured: false, salesCount: 35, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-silicone-v.jpg" },
    { name: "Pipe de Metal Pequeno", sku: "PIP-009", shortDescription: "Pipe de metal compacto e discreto.", description: "Pipe de metal pequeno, ideal para transporte. Metal cromado resistente. Design compacto e discreto. Facil de desmontar para limpeza.", categoryId: catPipes.id, brand: "Generico", tags: ["pipe","metal","compacto"], price: 22.50, stock: 50, featured: false, salesCount: 75, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-metal-pequeno.jpg" },
    { name: "Pipe de Madeira Curvo", sku: "PIP-010", shortDescription: "Pipe de madeira com design curvo classico.", description: "Pipe de madeira com formato curvo classico. Madeira selecionada com acabamento artesanal. Bowl generoso. Estilo vintage.", categoryId: catPipes.id, brand: "Artesanal", tags: ["pipe","madeira","curvo"], price: 55.00, stock: 15, featured: true, salesCount: 30, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-madeira-curvo.jpg" },
    { name: "Pipe Acrilico Transparente", sku: "PIP-011", shortDescription: "Pipe de acrilico transparente e leve.", description: "Pipe de acrilico transparente. Material leve e resistente. Design moderno. Ideal para iniciantes.", categoryId: catPipes.id, brand: "Generico", tags: ["pipe","acrilico","transparente"], price: 18.00, stock: 60, featured: false, salesCount: 85, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-acrilico.jpg" },
    { name: "Pipe de Vidro Colorido", sku: "PIP-012", shortDescription: "Pipe de vidro com cores vibrantes.", description: "Pipe de vidro borossilicato colorido artesanal. Cada peca e unica com combinacoes de cores diferentes. Resistente e funcional.", categoryId: catPipes.id, brand: "Artesanal", tags: ["pipe","vidro","colorido"], price: 42.00, stock: 25, featured: false, salesCount: 40, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/pipe-vidro-colorido.jpg" },

    // === NARGUILE (12 produtos) ===
    { name: "Carvao Zomo 1Kg", sku: "NAR-001", shortDescription: "Carvao de coco Zomo embalagem 1kg.", description: "Carvao de coco Zomo 1Kg. Carvao natural de casca de coco. Queima longa e uniforme, sem sabor residual. O mais vendido do Brasil.", categoryId: catNarguile.id, brand: "Zomo", tags: ["carvao","coco","1kg"], price: 63.90, stock: 50, featured: true, salesCount: 150, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/carvao-zomo-1kg.jpg" },
    { name: "Carvao Zomo - 500g", sku: "NAR-002", shortDescription: "Carvao de coco Zomo embalagem 500g.", description: "Carvao de coco Zomo 500g. Mesmo carvao premium em embalagem menor. Ideal para quem fuma com menos frequencia.", categoryId: catNarguile.id, brand: "Zomo", tags: ["carvao","coco","500g"], price: 32.90, stock: 80, featured: false, salesCount: 120, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/carvao-zomo-500g.jpg" },
    { name: "Mangueira p/ Narguile Brazuka", sku: "NAR-003", shortDescription: "Mangueira basica Brazuka para narguile.", description: "Mangueira Brazuka para narguile. Mangueira simples e funcional. Compativel com a maioria dos narguiles. Custo-beneficio imbativel.", categoryId: catNarguile.id, brand: "Brazuka", tags: ["mangueira","basica"], price: 9.90, stock: 100, featured: false, salesCount: 180, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/mangueira-brazuka.jpg" },
    { name: "Mangueira p/ Narguile AV Hookah", sku: "NAR-004", shortDescription: "Mangueira premium AV Hookah.", description: "Mangueira AV Hookah premium para narguile. Material de alta qualidade, lavavel. Bocal confortavel. Diversas cores disponiveis.", categoryId: catNarguile.id, brand: "AV Hookah", tags: ["mangueira","premium"], price: 49.90, promoPrice: 42.90, stock: 30, featured: true, salesCount: 55, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/mangueira-av-hookah.jpg" },
    { name: "Mangueira p/ Narguile Al Farid", sku: "NAR-005", shortDescription: "Mangueira Al Farid estilo tradicional.", description: "Mangueira Al Farid para narguile. Estilo tradicional arabe. Material duravel e lavavel. Bocal em madeira.", categoryId: catNarguile.id, brand: "Al Farid", tags: ["mangueira","tradicional"], price: 39.90, stock: 25, featured: false, salesCount: 40, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/mangueira-al-farid.jpg" },
    { name: "Mangueira de Silicone p/ Narguile", sku: "NAR-006", shortDescription: "Mangueira de silicone lavavel.", description: "Mangueira de silicone premium para narguile. 100% lavavel, nao retém cheiro. Material alimenticio atóxico. Flexivel e duravel.", categoryId: catNarguile.id, brand: "Generico", tags: ["mangueira","silicone","lavavel"], price: 49.90, stock: 35, featured: false, salesCount: 65, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/mangueira-silicone.jpg" },
    { name: "Mangueira p/ Narguile Zomo", sku: "NAR-007", shortDescription: "Mangueira Zomo basica e funcional.", description: "Mangueira Zomo para narguile. Design simples, material resistente. Compativel com narguiles de encaixe padrao. Otimo custo-beneficio.", categoryId: catNarguile.id, brand: "Zomo", tags: ["mangueira","zomo"], price: 11.90, stock: 120, featured: false, salesCount: 140, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/mangueira-zomo.jpg" },
    { name: "Essencia Ziggy Watermelon Bomb", sku: "NAR-008", shortDescription: "Essencia de melancia refrescante.", description: "Essencia Ziggy Watermelon Bomb para narguile. Sabor intenso de melancia refrescante. Rende ate 10 sessoes. Embalagem 50g.", categoryId: catNarguile.id, brand: "Ziggy", tags: ["essencia","melancia"], price: 18.90, stock: 60, featured: true, salesCount: 88, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-watermelon.jpg" },
    { name: "Essencia Ziggy Mix Cherry Starburst 50g", sku: "NAR-009", shortDescription: "Essencia de cereja doce e intensa.", description: "Essencia Ziggy Mix Cherry Starburst 50g. Sabor de cereja intensa com toque adocicado. Alta producao de fumaca.", categoryId: catNarguile.id, brand: "Ziggy", tags: ["essencia","cereja"], price: 18.90, stock: 55, featured: false, salesCount: 72, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-cherry.jpg" },
    { name: "Fogareiro Fogao Volcano Portatil C/ Sensor", sku: "NAR-010", shortDescription: "Fogareiro eletrico portatil com sensor de seguranca.", description: "Fogareiro eletrico Volcano portatil com sensor de seguranca. Ideal para acender carvao de narguile. Potencia 600W. Compacto e eficiente.", categoryId: catNarguile.id, brand: "Volcano", tags: ["fogareiro","eletrico","portatil"], price: 417.90, promoPrice: 379.90, stock: 8, featured: true, salesCount: 18, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/fogareiro-volcano.jpg" },
    { name: "Rosh Narguile Premium", sku: "NAR-011", shortDescription: "Rosh de ceramica premium para narguile.", description: "Rosh de ceramica premium para narguile. Boa distribuicao de calor, maior durabilidade. Encaixe padrao. Varias cores disponiveis.", categoryId: catNarguile.id, brand: "Generico", tags: ["rosh","ceramica","premium"], price: 35.00, stock: 40, featured: false, salesCount: 55, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/rosh-premium.jpg" },
    { name: "Prato para Narguile", sku: "NAR-012", shortDescription: "Prato coletor de cinzas para narguile.", description: "Prato para narguile em aluminio. Coletor de cinzas e brasas. Encaixe universal. Acabamento anodizado resistente.", categoryId: catNarguile.id, brand: "Generico", tags: ["prato","aluminio"], price: 28.00, stock: 45, featured: false, salesCount: 70, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/prato-narguile.jpg" },

    // === ESSENCIAS (12 produtos) ===
    { name: "Essencia Ziggy Watermelon Bomb", sku: "ESS-001", shortDescription: "Melancia explosiva refrescante.", description: "Essencia Ziggy Watermelon Bomb. Sabor intenso de melancia refrescante com toque gelado. Alta producao de fumaca. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","melancia","refrescante"], price: 18.90, stock: 70, featured: true, salesCount: 95, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-watermelon-bomb.jpg" },
    { name: "Essencia Ziggy Yogurt", sku: "ESS-002", shortDescription: "Sabor cremoso de iogurte.", description: "Essencia Ziggy Yogurt. Sabor unico e cremoso de iogurte. Suave e adocicado. Ideal para quem busca algo diferente. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","iogurte","cremoso"], price: 18.90, stock: 50, featured: false, salesCount: 55, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-yogurt.jpg" },
    { name: "Essencia Ziggy Fresh Melon", sku: "ESS-003", shortDescription: "Melao fresco e suave.", description: "Essencia Ziggy Fresh Melon. Sabor leve de melao fresco. Otima para dias quentes. Fumaca densa e saborosa. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","melao","fresco"], price: 15.90, promoPrice: 12.90, stock: 65, featured: false, salesCount: 62, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-fresh-melon.jpg" },
    { name: "Essencia Ziggy Mix Cherry Starburst 50g", sku: "ESS-004", shortDescription: "Mix de cereja doce intensa.", description: "Essencia Ziggy Mix Cherry Starburst 50g. Explosao de cereja doce com toque de frutas vermelhas. Sabor intenso e duradouro.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","cereja","mix"], price: 18.90, stock: 55, featured: true, salesCount: 80, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-mix-cherry.jpg" },
    { name: "Essencia Ziggy Grape Punch", sku: "ESS-005", shortDescription: "Uva intensa e refrescante.", description: "Essencia Ziggy Grape Punch. Sabor vibrante de uva roxa com final refrescante. Fumaca densa e aromatica. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","uva","punch"], price: 18.90, stock: 60, featured: true, salesCount: 75, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-grape.jpg" },
    { name: "Essencia Ziggy Mango Tango", sku: "ESS-006", shortDescription: "Manga tropical e envolvente.", description: "Essencia Ziggy Mango Tango. Sabor doce de manga madura com toque tropical. Sessoes longas e saborosas. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","manga","tropical"], price: 18.90, promoPrice: 15.90, stock: 50, featured: false, salesCount: 58, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-mango.jpg" },
    { name: "Essencia Ziggy Strawberry Shortcake", sku: "ESS-007", shortDescription: "Morango com bolo cremoso.", description: "Essencia Ziggy Strawberry Shortcake. Sabor unico de morango com bolo de nata. Doce e cremoso. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","morango","bolo"], price: 18.90, stock: 45, featured: false, salesCount: 50, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-strawberry.jpg" },
    { name: "Essencia Ziggy Blueberry Mint", sku: "ESS-008", shortDescription: "Mirtilo com menta gelada.", description: "Essencia Ziggy Blueberry Mint. Combinacao perfeita de mirtilo doce com menta refrescante. Fumaca gelada e saborosa. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","mirtilo","menta"], price: 18.90, stock: 55, featured: true, salesCount: 70, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-blueberry.jpg" },
    { name: "Essencia Ziggy Peach Paradise", sku: "ESS-009", shortDescription: "Pessego doce e paradisiaco.", description: "Essencia Ziggy Peach Paradise. Sabor suave e doce de pessego maduro. Sessoes relaxantes e aromaticas. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","pessego","doce"], price: 18.90, stock: 50, featured: false, salesCount: 45, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-peach.jpg" },
    { name: "Essencia Ziggy Coconut Dream", sku: "ESS-010", shortDescription: "Coco tropical e sonhador.", description: "Essencia Ziggy Coconut Dream. Sabor cremoso de coco com toque tropical. Suave e relaxante. Ideal para o verao. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","coco","tropical"], price: 18.90, stock: 40, featured: false, salesCount: 38, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-coconut.jpg" },
    { name: "Essencia Ziggy Pineapple Express", sku: "ESS-011", shortDescription: "Abacaxi explosivo e acido.", description: "Essencia Ziggy Pineapple Express. Sabor intenso de abacaxi maduro com toque acido. Refrescante e vibrante. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","abacaxi","acido"], price: 18.90, promoPrice: 15.90, stock: 55, featured: false, salesCount: 42, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-pineapple.jpg" },
    { name: "Essencia Ziggy Tropical Mix", sku: "ESS-012", shortDescription: "Mix tropical com frutas variadas.", description: "Essencia Ziggy Tropical Mix. Combinacao de frutas tropicais: manga, maracuja, abacaxi e goiaba. Sabor exotico e vibrante. 50g.", categoryId: catEssencias.id, brand: "Ziggy", tags: ["essencia","tropical","mix"], price: 18.90, stock: 60, featured: true, salesCount: 65, img: "https://www.tabacariadamata.com.br/media/catalog/product/cache/1/small_image/272x372/9df78eab33525d08d6e5fb8d27136e95/essencia-ziggy-tropical.jpg" },
  ]

  for (const p of products) {
    const { img, ...rest } = p
    const slug = slugify(rest.name) + "-" + rest.sku.toLowerCase()
    const prod = await prisma.product.create({ data: { ...rest, slug } as any })
    await prisma.productImage.create({
      data: { productId: prod.id, url: img, alt: prod.name, isPrimary: true, order: 0 },
    })
  }
  console.log(`${products.length} produtos criados!`)

  // BANNERS
  console.log("Criando banners...")
  await Promise.all([
    prisma.banner.create({ data: { title: "Sedas e Piteiras - As Melhores Marcas", desktopImage: BANNER_IMG.b1, mobileImage: BANNER_IMG.b1, link: "/categoria/sedas", position: "HERO", order: 1, active: true } }),
    prisma.banner.create({ data: { title: "Bongs e Acessorios Premium", desktopImage: BANNER_IMG.b2, mobileImage: BANNER_IMG.b2, link: "/categoria/bongs", position: "HERO", order: 2, active: true } }),
    prisma.banner.create({ data: { title: "Pipes de Todos os Estilos", desktopImage: BANNER_IMG.b3, mobileImage: BANNER_IMG.b3, link: "/categoria/pipes", position: "HERO", order: 3, active: true } }),
    prisma.banner.create({ data: { title: "Narguile - Tudo para sua Sessao", desktopImage: BANNER_IMG.b4, mobileImage: BANNER_IMG.b4, link: "/categoria/narguile", position: "HERO", order: 4, active: true } }),
  ])

  // COUPONS
  console.log("Criando cupons...")
  await Promise.all([
    prisma.coupon.create({ data: { code: "BEMVINDO10", type: "PERCENTAGE", value: 10, minOrder: 50, maxUses: 500, maxUsesPerUser: 1, active: true } }),
    prisma.coupon.create({ data: { code: "SEDA20", type: "FIXED", value: 20, minOrder: 100, maxUses: 200, active: true } }),
    prisma.coupon.create({ data: { code: "FRETEGRATIS", type: "FIXED", value: 30, minOrder: 250, maxUses: 100, active: true } }),
    prisma.coupon.create({ data: { code: "PREMIUM15", type: "PERCENTAGE", value: 15, minOrder: 300, maxUses: 50, active: true } }),
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
      metaTitle: "Oeste Tabacaria | Sedas, Bongs, Pipes, Narguile e Essencias",
      metaDescription: "A melhor tabacaria de Presidente Prudente. Sedas, bongs, pipes, narguile e essencias com os melhores precos.",
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
