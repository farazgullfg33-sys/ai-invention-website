import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const isMainSite = host === 'aiinvention.tech' || host === 'www.aiinvention.tech'

  if (isMainSite) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/client')) {
      return new NextResponse('Not Found', { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
}
