import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { auth } from '@/lib/auth'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { AccessToken } = twilio.jwt
  const { ChatGrant } = AccessToken
  const accessToken = new AccessToken(
    envServer.TWILIO_ACCOUNT_SID,
    envServer.TWILIO_API_KEY,
    envServer.TWILIO_API_SECRET,
    {
      identity: session.user.email,
      ttl: 86400,
    },
  )
  const chatGrand = new ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID,
  })

  accessToken.addGrant(chatGrand)

  return NextResponse.json({ access_token: accessToken.toJwt() }, { status: 200 })
}
