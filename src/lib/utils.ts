import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numPrice)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function calculateDiscount(price: number, promoPrice: number): number {
  return Math.round(((price - promoPrice) / price) * 100)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `OT-${timestamp}-${random}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function isPromoActive(
  promoPrice: number | null,
  promoStart: Date | null,
  promoEnd: Date | null
): boolean {
  if (!promoPrice) return false
  const now = new Date()
  if (promoStart && now < promoStart) return false
  if (promoEnd && now > promoEnd) return false
  return true
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + "..."
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  AWAITING_PAYMENT: "Aguardando Pagamento",
  PAID: "Pago",
  SEPARATING: "Separando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  RETURNED: "Devolvido",
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  AWAITING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  SEPARATING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-gray-100 text-gray-800",
}
