import { NextResponse } from 'next/server'
import { Twilio } from 'twilio'
import { CHANNEL_ADMIN_ROLE } from '@/lib/constants'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

const client = new Twilio(envServer.TWILIO_ACCOUNT_SID, envServer.TWILIO_AUTH_TOKEN)

export async function POST(request: Request) {
  const { chatId, participantId } = await request.json()

  if (!chatId || !participantId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const roles = await client.conversations.v1.services(envServer.TWILIO_SERVICE_SID).roles.list()
  const adminRole = roles.find((role) => role.friendlyName === CHANNEL_ADMIN_ROLE)

  if (!adminRole) {
    return NextResponse.json({ error: 'Admin role not found' }, { status: 500 })
  }

  try {
    await client.conversations.v1.conversations(chatId).participants(participantId).update({ roleSid: adminRole.sid })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'

    console.error('[api/twilio:make_admin]:', error)
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
