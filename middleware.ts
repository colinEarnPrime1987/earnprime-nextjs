import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

function isAuthPath(pathname: string): boolean {
  // Login page and auth API routes must be accessible unauthenticated
  if (pathname === '/login') return true
  if (pathname.startsWith('/api/auth/')) return true

  // TODO: Re-enable /register when ready for production
  // Registration is disabled — only Google Workspace SSO is active
  if (pathname === '/register') return false

  // Static files and Next.js internals
  if (pathname.startsWith('/_next/')) return true
  if (pathname.startsWith('/favicon')) return true
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2)$/)) return true

  return false
}

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (isAuthPath(pathname)) {
    return NextResponse.next()
  }

  // Check for NextAuth session (Google SSO)
  if (req.auth) {
    return NextResponse.next()
  }

  // TODO: Re-enable custom session cookie check when email/password login is restored
  // const sessionId = req.cookies.get('sessionId')?.value
  // if (sessionId) {
  //   return NextResponse.next()
  // }

  // Unauthenticated — redirect to login
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('callbackUrl', pathname)
  return NextResponse.redirect(loginUrl)
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
