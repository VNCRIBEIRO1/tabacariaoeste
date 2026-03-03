import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
})

export const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  slug: z.string().min(1, "Slug obrigatório"),
  sku: z.string().min(1, "SKU obrigatório"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  brand: z.string().optional(),
  origin: z.string().optional(),
  tags: z.array(z.string()).default([]),
  price: z.coerce.number().min(0.01, "Preço obrigatório"),
  costPrice: z.coerce.number().optional(),
  promoPrice: z.coerce.number().optional(),
  promoStart: z.string().optional(),
  promoEnd: z.string().optional(),
  stock: z.coerce.number().int().default(0),
  minStock: z.coerce.number().int().default(0),
  trackStock: z.boolean().default(true),
  active: z.boolean().default(true),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featured: z.boolean().default(false),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  slug: z.string().min(1, "Slug obrigatório"),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})

export const couponSchema = z.object({
  code: z.string().min(1, "Código obrigatório").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(0.01, "Valor obrigatório"),
  minOrder: z.coerce.number().optional(),
  maxUses: z.coerce.number().int().optional(),
  maxUsesPerUser: z.coerce.number().int().default(1),
  active: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
  productIds: z.array(z.string()).default([]),
})

export const bannerSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  desktopImage: z.string().min(1, "Imagem desktop obrigatória"),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  position: z.enum(["HERO", "INTERMEDIATE", "SIDEBAR"]).default("HERO"),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(1, "Nome do destinatário obrigatório"),
  cep: z.string().min(8, "CEP obrigatório"),
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
  isDefault: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF obrigatório"),
  phone: z.string().min(10, "Telefone obrigatório"),
  addressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  paymentMethod: z.enum(["PIX", "CREDIT_CARD", "DEBIT_CARD", "BOLETO"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CouponInput = z.infer<typeof couponSchema>
export type BannerInput = z.infer<typeof bannerSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
