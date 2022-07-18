import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { getToken } from 'next-auth/jwt'

interface Data {
  error?: string
  accessToken?: string
}

const {
  JWT_SECRET,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_ACCOUNT_SID,
  TWILIO_SERVICE_SID,
} = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const token = await getToken({ req, secret: JWT_SECRET })

  if (!token)
    return res.status(401).json({
      error: 'Invalid token',
    })

  const { AccessToken } = twilio.jwt
  const { ChatGrant } = AccessToken

  const accessToken = new AccessToken(
    TWILIO_ACCOUNT_SID as string,
    TWILIO_API_KEY as string,
    TWILIO_API_SECRET as string,
    {
      identity: token.email as string,
      ttl: 86400,
    },
  )

  const chatGrand = new ChatGrant({
    serviceSid: TWILIO_SERVICE_SID,
  })

  accessToken.addGrant(chatGrand)

  return res.status(200).json({
    accessToken: accessToken.toJwt(),
  })
}
