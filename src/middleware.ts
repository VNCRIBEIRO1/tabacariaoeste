import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    const session = await auth()

    if (!session) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", request.url))
    }

    const userRole = session.user?.role
    if (!["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Account routes protection
  if (pathname.startsWith("/conta")) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + pathname, request.url))
    }
  }

  // Checkout protection
  if (pathname.startsWith("/checkout")) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/checkout", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/conta/:path*", "/checkout/:path*"],
}
