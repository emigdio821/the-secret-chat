import { NextResponse } from 'next/server'
import { Twilio } from 'twilio'
import { CHANNEL_ADMIN_ROLE } from '@/lib/constants'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

const client = new Twilio(envServer.TWILIO_ACCOUNT_SID, envServer.TWILIO_AUTH_TOKEN)

export async function POST(req: Request) {
  try {
    const { chatId, identity } = await req.json()
    const service = client.conversations.v1.services(envServer.TWILIO_SERVICE_SID)
    const participants = await service.conversations(chatId).participants.list()
    const userParticipant = participants.find((p) => p.identity === identity)

    if (!userParticipant) {
      return NextResponse.json({ isAdmin: false })
    }

    const roles = await service.roles.list()
    const adminRole = roles.find((r) => r.friendlyName === CHANNEL_ADMIN_ROLE)
    const isAdmin = userParticipant.roleSid === adminRole?.sid

    return NextResponse.json({ isAdmin })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'

    console.error('[api/twilio/is-admin]', error)
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
