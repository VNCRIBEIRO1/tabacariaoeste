import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", request.url))
    }

    const userRole = token.role as string
    if (!["ADMIN", "SUPER_ADMIN", "EDITOR", "OPERATOR"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Account routes protection
  if (pathname.startsWith("/conta")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + pathname, request.url))
    }
  }

  // Checkout protection
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/checkout", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/conta/:path*", "/checkout/:path*"],
}
