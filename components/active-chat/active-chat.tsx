import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ChatAttributes } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import type { Client, Conversation, Message, Participant } from '@twilio/conversations'
import { ArrowLeftIcon, GhostIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  ACTIVE_CHAT_MESSAGES_QUERY,
  ACTIVE_CHAT_QUERY,
  ACTIVE_PARTICIPANTS_QUERY,
  MSG_PARTICIPANT_QUERY,
  USER_CHATS_QUERY,
} from '@/lib/constants'
import { useTypingParticipantsStore } from '@/lib/stores/typing-participants.store'
import { useCurrentChat } from '@/hooks/chat/use-current-chat'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '../loader'
import { TypographyH4 } from '../ui/typography'
import ChatActions from './chat-actions'
import { Messages } from './messages'

interface ActiveChatProps {
  client: Client
  chatId: string
}

export function ActiveChat({ client, chatId }: ActiveChatProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: chat, isLoading } = useCurrentChat(chatId)
  const chatAttrs = chat?.attributes as ChatAttributes | undefined
  const setTypingParticipant = useTypingParticipantsStore((state) => state.setTypingParticipant)
  const removeTypingParticipant = useTypingParticipantsStore((state) => state.removeTypingParticipant)

  const handleMessageAdded = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
  }, [queryClient])

  const handleChatRemoved = useCallback(
    (chat: Conversation) => {
      toast('Info', {
        description: (
          <>
            <span className="font-semibold">{chat.friendlyName ?? chat.uniqueName}</span> chat was removed by the admin
            or you were removed from it.
          </>
        ),
      })
      router.push('/')
    },
    [router],
  )

  const handleUpdatedChat = useCallback(
    async ({ conversation, updateReasons }: { conversation: Conversation; updateReasons: string[] }) => {
      const relevantUpdates = ['attributes', 'friendlyName']
      const shouldUpdate = updateReasons.some((reason) => relevantUpdates.includes(reason))
      if (!shouldUpdate) return

      const newCovo = Object.create(conversation)
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
      queryClient.setQueryData([ACTIVE_CHAT_QUERY, chatId], newCovo)
    },
    [chatId, queryClient],
  )

  const handleParticipantJoined = useCallback(
    async (participant: Participant) => {
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })

      toast('Info', {
        description: (
          <span>
            <span className="font-semibold">{participant.identity}</span> has joined the chat.
          </span>
        ),
      })
    },
    [queryClient],
  )

  const handleParticipantLeft = useCallback(
    async (participant: Participant) => {
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })

      if (participant.identity !== client.user.identity) {
        toast('Info', {
          description: (
            <span>
              <span className="font-semibold">{participant.identity}</span> has left the chat.
            </span>
          ),
        })
      }
    },
    [client.user.identity, queryClient],
  )

  const handleTyping = useCallback(
    async (participant: Participant) => {
      setTypingParticipant(participant)
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
    },
    [queryClient, setTypingParticipant],
  )

  const handleUpdatedMessage = useCallback(
    async ({ message }: { message: Message }) => {
      await queryClient.resetQueries({ queryKey: [MSG_PARTICIPANT_QUERY, message.sid] })
    },
    [queryClient],
  )

  const handleMessageRemoved = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [ACTIVE_CHAT_QUERY, chatId] })
  }, [queryClient, chatId])

  const handleRemoveTyping = useCallback(
    async (participant: Participant) => {
      removeTypingParticipant(participant)
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
    },
    [queryClient, removeTypingParticipant],
  )

  const handleUpdatedParticipant = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
  }, [queryClient])

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
      chat.on('updated', handleUpdatedChat)
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
        chat.removeListener('updated', handleUpdatedChat)
      }
    }
  }, [
    chat,
    handleMessageAdded,
    handleMessageRemoved,
    handleTyping,
    handleRemoveTyping,
    handleChatRemoved,
    handleParticipantJoined,
    handleParticipantLeft,
    handleUpdatedParticipant,
    handleUpdatedMessage,
    handleUpdatedChat,
  ])

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
