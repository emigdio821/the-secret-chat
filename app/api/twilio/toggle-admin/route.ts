import { NextResponse } from 'next/server'
import { Twilio } from 'twilio'
import { CHANNEL_ADMIN_ROLE, CHANNEL_USER_ROLE } from '@/lib/constants'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

const client = new Twilio(envServer.TWILIO_ACCOUNT_SID, envServer.TWILIO_AUTH_TOKEN)
const SERVICE = client.conversations.v1.services(envServer.TWILIO_SERVICE_SID)

export async function POST(request: Request) {
  const { chatId, participantId } = await request.json()

  if (!chatId || !participantId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const conversation = SERVICE.conversations(chatId)
    const participant = await conversation.participants(participantId).fetch()

    const roles = await SERVICE.roles.list()
    const adminRole = roles.find((role) => role.friendlyName === CHANNEL_ADMIN_ROLE)
    const userRole = roles.find((role) => role.friendlyName === CHANNEL_USER_ROLE)

    if (!adminRole || !userRole) {
      return NextResponse.json({ error: 'Roles not found' }, { status: 500 })
    }

    const isCurrentlyAdmin = participant.roleSid === adminRole.sid
    const newRoleSid = isCurrentlyAdmin ? userRole.sid : adminRole.sid

    await conversation.participants(participantId).update({ roleSid: newRoleSid })

    return NextResponse.json({
      success: true,
      newRole: isCurrentlyAdmin ? 'user' : 'admin',
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[api/twilio/toggle-admin]', error)
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
