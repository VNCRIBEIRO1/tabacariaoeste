import { Header } from "@/components/store/header"
import { Footer } from "@/components/store/footer"
import { CartDrawer } from "@/components/store/cart-drawer"
import { WhatsAppButton } from "@/components/store/whatsapp-button"
import { AgeVerification } from "@/components/store/age-verification"
import { CookieBanner } from "@/components/store/cookie-banner"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AgeVerification />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}
