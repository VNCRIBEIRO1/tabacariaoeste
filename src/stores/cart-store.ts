import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  price: number
  promoPrice?: number
  quantity: number
  variantId?: string
  variantInfo?: string
  maxStock: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          )

          if (existingIndex > -1) {
            const updatedItems = [...state.items]
            const existing = updatedItems[existingIndex]
            const newQty = existing.quantity + (newItem.quantity || 1)
            updatedItems[existingIndex] = {
              ...existing,
              quantity: Math.min(newQty, existing.maxStock),
            }
            return { items: updatedItems, isOpen: true }
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity || 1 },
            ],
            isOpen: true,
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        const items = get().items
        return items.reduce((total, item) => {
          const price = item.promoPrice || item.price
          return total + price * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "oeste-tabacaria-cart",
    }
  )
)
