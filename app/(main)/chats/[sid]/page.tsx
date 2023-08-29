'use client'

import { useStore } from '@/lib/store'
import { useTwilioClient } from '@/hooks/use-twilio-client'
import { ActiveChatContainer } from '@/components/active-chat/active-chat-container'
import { FullChatSkeleton } from '@/components/active-chat/chat-seketon'

interface ChatsPageProps {
  params: { sid: string }
}

export default function ChatsPage({ params }: ChatsPageProps) {
  const client = useStore((state) => state.client)
  const { isLoading: clientLoading } = useTwilioClient()

  return (
    <>
      {!client && clientLoading && <FullChatSkeleton />}
      {client && <ActiveChatContainer client={client} chatId={params.sid} />}
    </>
  )
}
