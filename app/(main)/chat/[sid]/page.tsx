import { type Metadata } from 'next/types'

import { ActiveChatContainer } from '@/components/active-chat/active-chat-container'

interface ChatsPageProps {
  params: { sid: string }
  searchParams: { name: string }
}

export async function generateMetadata({ searchParams }: ChatsPageProps): Promise<Metadata> {
  const chatName = searchParams.name

  return {
    title: {
      default: chatName,
      template: `%s · ${chatName}`,
    },
  }
}

export default function ChatPage({ params }: ChatsPageProps) {
  const chatId = params.sid

  return <ActiveChatContainer chatId={chatId} />
}
