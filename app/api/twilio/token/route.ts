import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import twilio from 'twilio'

import { envSchema } from '@/lib/zod-schemas'

const env = envSchema.parse(process.env)

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { AccessToken } = twilio.jwt
  const { ChatGrant } = AccessToken
  const accessToken = new AccessToken(
    env.TWILIO_ACCOUNT_SID,
    env.TWILIO_API_KEY,
    env.TWILIO_API_SECRET,
    {
      identity: token.email,
      ttl: 86400,
    },
  )
  const chatGrand = new ChatGrant({
    serviceSid: env.TWILIO_SERVICE_SID,
  })

  accessToken.addGrant(chatGrand)

  return NextResponse.json({ access_token: accessToken.toJwt() }, { status: 200 })
}
