import { NextResponse } from 'next/server'
import { Twilio } from 'twilio'
import { CHANNEL_ADMIN_ROLE } from '@/lib/constants'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

const client = new Twilio(envServer.TWILIO_ACCOUNT_SID, envServer.TWILIO_AUTH_TOKEN)

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json()

    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 })
    }

    const service = client.conversations.v1.services(envServer.TWILIO_SERVICE_SID)
    const conversation = service.conversations(chatId)
    const participants = await conversation.participants.list()
    const roles = await service.roles.list()
    const adminRole = roles.find((r) => r.friendlyName === CHANNEL_ADMIN_ROLE)

    if (!adminRole) {
      return NextResponse.json({ error: 'Admin role not found' }, { status: 500 })
    }

    const admins = participants.filter((p) => p.roleSid === adminRole.sid)
    // .map((p) => ({
    //   identity: p.identity,
    //   sid: p.sid,
    // }))

    return NextResponse.json(admins)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[api/twilio/chat-admins]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
