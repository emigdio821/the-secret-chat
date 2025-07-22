import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*', '/settings', '/', '/api/twilio/:path*', '/api/giphy/:path*'],
}
