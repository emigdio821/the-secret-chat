'use client'

import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { ClientError } from '@/components/client-error'
import { FullChatSkeleton } from '@/components/skeletons'
import { ActiveChat } from './active-chat'

interface ActiveChatContainerProps {
  chatId: string
}

export function ActiveChatContainer({ chatId }: ActiveChatContainerProps) {
  const client = useTwilioClientStore((state) => state.client)
  const error = useTwilioClientStore((state) => state.error)
  const loading = useTwilioClientStore((state) => state.loading)

  if (error) {
    return <ClientError />
  }

  return <>{loading ? <FullChatSkeleton /> : client && <ActiveChat client={client} chatId={chatId} />}</>
}
