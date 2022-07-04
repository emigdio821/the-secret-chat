import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  // const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  // console.log(pathname)

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/chat', '/'],
}
