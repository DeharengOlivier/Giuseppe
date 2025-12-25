import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Protéger les routes admin (sauf login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Rediriger vers dashboard si déjà connecté et tentative d'accès au login
  if (pathname.startsWith('/admin/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
