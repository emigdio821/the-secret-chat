'use client'

import { useRouter } from 'next/navigation'
import { RefreshCcw } from 'lucide-react'
import { type Session } from 'next-auth'

import { useStore } from '@/lib/store'
import { useTwilioClient } from '@/hooks/use-twilio-client'
import { Button } from '@/components/ui/button'
import { CreateOrJoinChat } from '@/components/create-or-join'

import { ChatList } from './my-chats'

export function UserChats({ session }: { session: Session }) {
  const router = useRouter()
  const client = useStore((state) => state.client)
  const { error, isLoading } = useTwilioClient()

  if (error) {
    return (
      <div className="mt-4 flex flex-col gap-2 text-sm">
        Something went wrong while initializing Twilio client.
        <Button
          className="self-start"
          variant="outline"
          onClick={() => {
            router.refresh()
          }}
        >
          Refresh page
          <RefreshCcw className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <CreateOrJoinChat session={session} isLoading={isLoading} />
      {client && <ChatList client={client} session={session} />}
    </div>
  )
}
