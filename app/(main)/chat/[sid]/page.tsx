import { cache } from 'react'
import type { Metadata } from 'next'
import { Twilio } from 'twilio'
import { envServer } from '@/lib/zod-schemas/env/server.schema'
import { ActiveChatContainer } from '@/components/active-chat/active-chat-container'

interface ChatPageProps {
  params: Promise<{ sid: string }>
}

const getChatInfo = cache(async (chatId: string) => {
  const client = new Twilio(envServer.TWILIO_ACCOUNT_SID, envServer.TWILIO_AUTH_TOKEN)
  const service = client.conversations.v1.services(envServer.TWILIO_SERVICE_SID)
  const conversation = await service.conversations(chatId).fetch()
  return conversation
})

export async function generateMetadata(props: ChatPageProps) {
  const params = await props.params
  const chat = await getChatInfo(params.sid)

  return {
    title: chat.friendlyName,
  } satisfies Metadata
}

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params

  return <ActiveChatContainer chatId={params.sid} />
}
