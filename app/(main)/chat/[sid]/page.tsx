import { cache } from 'react'
import type { Metadata } from 'next'
import type { ChatAttributes } from '@/types'
import { Twilio } from 'twilio'
import { appOgUrl } from '@/config/site'
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
  const chatAttrs = chat.attributes ? (JSON.parse(chat.attributes) as ChatAttributes | undefined) : undefined

  return {
    title: chat.friendlyName,
    description: chatAttrs?.description,
    openGraph: {
      type: 'website',
      title: chat.friendlyName,
      description: chatAttrs?.description,
      url: appOgUrl,
      images: [
        {
          url: `/og?title=${encodeURIComponent(chat.friendlyName)}&description=${encodeURIComponent(chatAttrs?.description || '')}`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: chat.friendlyName,
      description: chatAttrs?.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(chat.friendlyName)}&description=${encodeURIComponent(chatAttrs?.description || '')}`,
        },
      ],
      creator: '@emigdio821',
    },
  } satisfies Metadata
}

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params

  return <ActiveChatContainer chatId={params.sid} />
}
