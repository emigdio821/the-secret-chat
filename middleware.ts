export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/chat/:path*', '/profile', '/', '/api/twilio/token'],
}
