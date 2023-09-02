import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import twilio from 'twilio'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { AccessToken } = twilio.jwt
  const { ChatGrant } = AccessToken
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID as string,
    process.env.TWILIO_API_KEY as string,
    process.env.TWILIO_API_SECRET as string,
    {
      identity: token.email,
      ttl: 86400,
    },
  )
  const chatGrand = new ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID,
  })

  accessToken.addGrant(chatGrand)

  return NextResponse.json({ access_token: accessToken.toJwt() }, { status: 200 })
}
