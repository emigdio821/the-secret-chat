import { useCallback, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { type UserAttributes } from '@/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Client,
  type Conversation,
  type Message,
  type Participant,
  type ParticipantUpdateReason,
} from '@twilio/conversations'
import { Home } from 'lucide-react'
import { toast } from 'sonner'

import {
  ACTIVE_CHAT_MESSAGES_QUERY,
  ACTIVE_CHAT_QUERY,
  ACTIVE_PARTICIPANTS_QUERY,
  USER_CHATS_QUERY,
} from '@/lib/constants'
// import { useStore } from '@/lib/store'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Messages } from '@/components/active-chat/messages'
import { FullChatSkeleton } from '@/components/skeletons'

import ChatActions from './chat-actions'

interface ActiveChatProps {
  client: Client
  chatId: string
}

interface ChatAttributes {
  description?: string
}

interface ParticipantUpdatedData {
  participant: Participant
  updateReasons: ParticipantUpdateReason[]
}

export function ActiveChat({ client, chatId }: ActiveChatProps) {
  const { data: chat, isLoading } = useQuery([ACTIVE_CHAT_QUERY], getCurrentChat)
  const queryClient = useQueryClient()
  const router = useRouter()
  // TODO: Handle user typing store
  // const addUsersTyping = useStore((state) => state.addUsersTyping)
  // const removeUsersTyping = useStore((state) => state.removeUsersTyping)
  const attrs = chat?.attributes as unknown as ChatAttributes

  async function getCurrentChat() {
    try {
      const chat = await client.getConversationBySid(chatId)
      const user = await client.getUser(client.user.identity)
      const attrs = user.attributes as unknown as UserAttributes

      if (chat?.status === 'notParticipating') {
        // await chat.join()
        await chat.add(client.user.identity, {
          nickname: user.friendlyName,
          avatar_url: attrs.avatar_url ?? '',
          name: attrs.name ?? '',
        })
      } else {
        const participant = await chat.getParticipantByIdentity(client.user.identity)
        await participant?.updateAttributes({
          nickname: user.friendlyName,
          avatar_url: attrs.avatar_url ?? '',
          name: attrs.name ?? '',
        })
      }

      return chat
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_CURRENT_CHAT]', errMessage)
      return null
    }
  }

  const handleChatRemoved = useCallback(
    (chat: Conversation) => {
      toast('Info', {
        description: (
          <>
            <span className="font-semibold">{chat.friendlyName ?? chat.uniqueName}</span> chat room
            was removed by the admin or you were removed from it.
          </>
        ),
      })
      router.push('/')
    },
    [router],
  )

  const handleParticipantJoined = useCallback(
    async (participant: Participant) => {
      await queryClient.refetchQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      await queryClient.refetchQueries({ queryKey: [USER_CHATS_QUERY] })

      toast('Info', {
        description: (
          <span>
            <span className="font-semibold">{participant.identity}</span> has joined the chat room
          </span>
        ),
      })
    },
    [queryClient],
  )

  const handleParticipantLeft = useCallback(
    async (participant: Participant) => {
      await queryClient.refetchQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      await queryClient.refetchQueries({ queryKey: [USER_CHATS_QUERY] })

      if (participant.identity !== client.user.identity) {
        toast('Info', {
          description: (
            <span>
              <span className="font-semibold">{participant.identity}</span> has left the chat room
            </span>
          ),
        })
      }
    },
    [client.user.identity, queryClient],
  )

  const handleMessageAdded = useCallback(
    async (message: Message) => {
      try {
        await chat?.updateLastReadMessageIndex(message.index)
        await queryClient.refetchQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[UPDATE_MSGS_INDEX]', errMessage)
      }
    },
    [chat, queryClient],
  )

  const handleMessageRemoved = useCallback(
    async (message: Message) => {
      try {
        await queryClient.refetchQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[MSG_REMOVED]', errMessage)
      }
    },
    [queryClient],
  )

  const handleUpdatedParticipant = useCallback(
    async (data: ParticipantUpdatedData) => {
      try {
        if (data.updateReasons.includes('attributes')) {
          await queryClient.resetQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
        }
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[UPDATED_PARTICIPANT]', errMessage)
      }
    },
    [queryClient],
  )

  const handleTyping = useCallback(async () => {
    try {
      await queryClient.resetQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[TYPING]', errMessage)
    }
  }, [queryClient])

  useEffect(() => {
    if (chat) {
      chat.on('messageAdded', handleMessageAdded)
      chat.on('messageRemoved', handleMessageRemoved)
      // chat.on('typingStarted', addUsersTyping)
      // chat.on('typingEnded', removeUsersTyping)
      chat.on('typingStarted', handleTyping)
      chat.on('typingEnded', handleTyping)
      chat.on('removed', handleChatRemoved)
      chat.on('participantJoined', handleParticipantJoined)
      chat.on('participantLeft', handleParticipantLeft)
      chat.on('participantUpdated', handleUpdatedParticipant)
    }

    return () => {
      if (chat) {
        chat.removeListener('messageAdded', handleMessageAdded)
        chat.removeListener('messageRemoved', handleMessageRemoved)
        chat.removeListener('typingStarted', handleTyping)
        chat.removeListener('typingEnded', handleTyping)
        chat.removeListener('removed', handleChatRemoved)
        chat.removeListener('participantJoined', handleParticipantJoined)
        chat.removeListener('participantLeft', handleParticipantLeft)
        chat.removeListener('participantUpdated', handleUpdatedParticipant)
        queryClient.removeQueries({ queryKey: [ACTIVE_CHAT_QUERY] })
        queryClient.removeQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
        queryClient.removeQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      }
    }
  }, [
    chat,
    queryClient,
    handleTyping,
    handleChatRemoved,
    handleMessageAdded,
    handleMessageRemoved,
    handleParticipantLeft,
    handleParticipantJoined,
    handleUpdatedParticipant,
  ])

  return (
    <>
      {isLoading ? (
        <FullChatSkeleton />
      ) : (
        <>
          {chat ? (
            <>
              <div className="flex justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{chat.friendlyName}</h3>
                  <h5 className="mb-4 text-sm text-muted-foreground">{attrs.description}</h5>
                </div>
                <ChatActions chat={chat} client={client} />
              </div>
              <Messages chat={chat} />
            </>
          ) : (
            <Card className="mx-auto max-w-sm">
              <CardHeader>
                <CardTitle>Chat not found</CardTitle>
                <CardDescription>
                  Seems like this chat no longer exists or you are not participating on it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NextLink href="/" className={buttonVariants({ variant: 'outline' })}>
                  Home
                  <Home className="ml-2 h-4 w-4" />
                </NextLink>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}
