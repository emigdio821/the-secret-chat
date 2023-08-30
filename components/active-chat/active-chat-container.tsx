'use client'

import { useTwilioClient } from '@/hooks/use-twilio-client'
import { FullChatSkeleton } from '@/components/active-chat/chat-seketon'
import { ClientError } from '@/components/client-error'

import { ActiveChat } from './active-chat'

interface ActiveChatContainerProps {
  chatId: string
}

export function ActiveChatContainer({ chatId }: ActiveChatContainerProps) {
  const { error, isLoading, client } = useTwilioClient()

  if (error) {
    return <ClientError />
  }

  return (
    <>
      {isLoading ? (
        <FullChatSkeleton />
      ) : (
        <>{client && <ActiveChat client={client} chatId={chatId} />}</>
      )}
    </>
  )
}
