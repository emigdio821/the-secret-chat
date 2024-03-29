'use client'

import { type Session } from 'next-auth'

import { useTwilioClient } from '@/hooks/use-twilio-client'
import { CreateOrJoinChat } from '@/components/create-or-join'
import { UserChatsSkeleton } from '@/components/skeletons'

import { ClientError } from '../client-error'
import { MyChats } from './my-chats'

export function MyChatsContainer({ session }: { session: Session }) {
  const { error, isLoading, client } = useTwilioClient()

  if (error) {
    return <ClientError errorMsg={error} />
  }

  return (
    <div className="mt-4">
      {isLoading ? (
        <UserChatsSkeleton />
      ) : (
        <>
          {client && (
            <>
              <CreateOrJoinChat client={client} isLoading={isLoading} />
              <MyChats client={client} session={session} />
            </>
          )}
        </>
      )}
    </div>
  )
}
