import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ChatAttributes, ParticipantAttributes } from '@/types'
import { useIdle, useWindowEvent } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import type {
  Client,
  Conversation,
  Message,
  MessageUpdateReason,
  Paginator,
  Participant,
  ParticipantUpdateReason,
} from '@twilio/conversations'
import { ArrowLeftIcon, GhostIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  ACTIVE_CHAT_MESSAGES_QUERY,
  ACTIVE_CHAT_QUERY,
  ACTIVE_PARTICIPANTS_QUERY,
  MESSAGE_PARTICIPANT_QUERY,
  USER_CHATS_QUERY,
} from '@/lib/constants'
import { useStore } from '@/lib/store'
import { useCurrentChat } from '@/hooks/chat/use-current-chat'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Messages } from '@/components/active-chat/messages'
import { Loader } from '../loader'
import { TypographyH4 } from '../ui/typography'
import ChatActions from './chat-actions'

interface ActiveChatProps {
  client: Client
  chatId: string
}

interface ParticipantUpdatedData {
  participant: Participant
  updateReasons: ParticipantUpdateReason[]
}

interface MessageUpdatedData {
  message: Message
  updateReasons: MessageUpdateReason[]
}

export function ActiveChat({ client, chatId }: ActiveChatProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: chat, isLoading } = useCurrentChat(chatId)
  const addUsersTyping = useStore((state) => state.addUsersTyping)
  const removeUsersTyping = useStore((state) => state.removeUsersTyping)
  const chatAttrs = chat?.attributes as ChatAttributes | undefined
  const isIdle = useIdle(300000)

  const handleChatRemoved = useCallback(
    (chat: Conversation) => {
      toast('Info', {
        description: (
          <>
            <span className="font-semibold">{chat.friendlyName ?? chat.uniqueName}</span> chat room was removed by the
            admin or you were removed from it.
          </>
        ),
      })
      router.push('/')
    },
    [router],
  )

  const handleParticipantJoined = useCallback(
    async (participant: Participant) => {
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })

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
      const partAttrs = participant.attributes as ParticipantAttributes
      partAttrs.isOnline = false

      // await participant.updateAttributes(partAttrs)
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })

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

        queryClient.setQueryData([ACTIVE_CHAT_MESSAGES_QUERY], (prev: Paginator<Message>) => {
          return {
            ...prev,
            items: [...prev.items, message],
          }
        })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[UPDATE_MSGS_INDEX]', errMessage)
      }
    },
    [chat, queryClient],
  )

  const handleUpdatedMessage = useCallback(
    async (data: MessageUpdatedData) => {
      try {
        await queryClient.resetQueries({ queryKey: [MESSAGE_PARTICIPANT_QUERY, data.message.sid] })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[UPDATE_MSG]', errMessage)
      }
    },
    [queryClient],
  )

  const handleMessageRemoved = useCallback(
    (message: Message) => {
      try {
        queryClient.setQueryData([ACTIVE_CHAT_MESSAGES_QUERY], (prev: Paginator<Message>) => {
          return {
            ...prev,
            items: prev.items.filter((msg) => msg.sid !== message.sid),
          }
        })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[MSG_REMOVED]', errMessage)
      }
    },
    [queryClient],
  )

  const handleUpdatedParticipant = useCallback(
    async (_data: ParticipantUpdatedData) => {
      try {
        await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
        // if (data.updateReasons.includes('attributes')) {
        //   await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
        // }
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[UPDATED_PARTICIPANT]', errMessage)
      }
    },
    [queryClient],
  )

  const handleTyping = useCallback(
    async (participant: Participant) => {
      try {
        addUsersTyping(participant)
        await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[TYPING]', errMessage)
      }
    },
    [queryClient, addUsersTyping],
  )

  const handleRemoveTyping = useCallback(
    async (participant: Participant) => {
      try {
        removeUsersTyping({ participant })
        await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : err
        console.log('[REMOVE_TYPING]', errMessage)
      }
    },
    [queryClient, removeUsersTyping],
  )

  const handleOfflineUser = useCallback(async () => {
    try {
      const participant = await chat?.getParticipantByIdentity(client.user.identity)
      const partAttrs = participant?.attributes as ParticipantAttributes
      if (partAttrs) partAttrs.isOnline = false

      await participant?.updateAttributes(partAttrs)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[SET_USER_OFFLINE]', errMessage)
    }
  }, [chat, client.user.identity])

  const handleUpdateCurrParticipantStatus = useCallback(
    async ({ isOnline = false }: { isOnline: boolean }) => {
      if (chat) {
        try {
          const participant = await chat.getParticipantByIdentity(client.user.identity)
          const partAttrs = participant?.attributes as ParticipantAttributes

          if (partAttrs.isOnline !== isOnline) {
            partAttrs.isOnline = isOnline
            const participant = await chat.getParticipantByIdentity(client.user.identity)
            await participant?.updateAttributes(partAttrs)
          }
        } catch (err) {
          const errMessage = err instanceof Error ? err.message : err
          console.log('[UPDATE_CURR_PART_ATTRS]', errMessage)
        }
      }
    },
    [chat, client.user.identity],
  )

  useWindowEvent('beforeunload', async () => {
    removeUsersTyping({ removeAll: true })
    await handleOfflineUser()
  })

  useWindowEvent('pagehide', async () => {
    removeUsersTyping({ removeAll: true })
    await handleOfflineUser()
  })

  useEffect(() => {
    if (chat) {
      chat.on('messageAdded', handleMessageAdded)
      chat.on('messageRemoved', handleMessageRemoved)
      chat.on('typingStarted', handleTyping)
      chat.on('typingEnded', handleRemoveTyping)
      chat.on('removed', handleChatRemoved)
      chat.on('participantJoined', handleParticipantJoined)
      chat.on('participantLeft', handleParticipantLeft)
      chat.on('participantUpdated', handleUpdatedParticipant)
      chat.on('messageUpdated', handleUpdatedMessage)
    }

    return () => {
      if (chat) {
        chat.removeListener('messageAdded', handleMessageAdded)
        chat.removeListener('messageRemoved', handleMessageRemoved)
        chat.removeListener('typingStarted', handleTyping)
        chat.removeListener('typingEnded', handleRemoveTyping)
        chat.removeListener('removed', handleChatRemoved)
        chat.removeListener('participantJoined', handleParticipantJoined)
        chat.removeListener('participantLeft', handleParticipantLeft)
        chat.removeListener('participantUpdated', handleUpdatedParticipant)
        chat.removeListener('messageUpdated', handleUpdatedMessage)
        queryClient.removeQueries({ queryKey: [ACTIVE_CHAT_QUERY] })
        queryClient.removeQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
        queryClient.removeQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
        removeUsersTyping({ removeAll: true })
        void handleOfflineUser()
      }
    }
  }, [
    chat,
    queryClient,
    handleTyping,
    removeUsersTyping,
    handleChatRemoved,
    handleOfflineUser,
    handleRemoveTyping,
    handleMessageAdded,
    handleMessageRemoved,
    handleUpdatedMessage,
    handleParticipantLeft,
    handleParticipantJoined,
    handleUpdatedParticipant,
  ])

  useEffect(() => {
    if (isIdle) {
      void handleUpdateCurrParticipantStatus({ isOnline: false })
    } else {
      void handleUpdateCurrParticipantStatus({ isOnline: true })
    }
  }, [isIdle, handleUpdateCurrParticipantStatus])

  if (isLoading) {
    return <Loader msg="Loading chat..." />
  }

  return (
    <>
      {chat ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <div>
              <TypographyH4>{chat.friendlyName}</TypographyH4>
              {chatAttrs?.description && <p className="text-muted-foreground text-sm">{chatAttrs.description}</p>}
            </div>
            <ChatActions chat={chat} client={client} />
          </div>
          <Messages chat={chat} />
        </>
      ) : (
        <Card>
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle className="mb-4">
              <GhostIcon className="size-6" />
            </CardTitle>
            <TypographyH4>Chat not found</TypographyH4>
            <CardDescription>This chat no longer exists or you are not participating on it</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeftIcon className="size-4" />
                Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
