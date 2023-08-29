'use client'

import { useStore } from '@/lib/store'
import { useTwilioClient } from '@/hooks/use-twilio-client'
import { ActiveChatContainer } from '@/components/active-chat/container'

interface ChatsPageProps {
  params: { sid: string }
}

export default function ChatsPage({ params }: ChatsPageProps) {
  const client = useStore((state) => state.client)
  const { isLoading: clientLoading } = useTwilioClient()

  return (
    <>
      {clientLoading && <div>Loading...</div>}
      {client && <ActiveChatContainer client={client} chatId={params.sid} />}
    </>
  )
}
