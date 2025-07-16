import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import type { ChatAttributes } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import type { Client, Conversation } from '@twilio/conversations'
import { ArrowLeftIcon, GhostIcon } from 'lucide-react'
import { ACTIVE_CHAT_MESSAGES_QUERY, ACTIVE_CHAT_QUERY } from '@/lib/constants'
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
  const queryClient = useQueryClient()
  const { data: chat, isLoading } = useCurrentChat(chatId)
  const chatAttrs = chat?.attributes as ChatAttributes | undefined

  const handleMessageAdded = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
  }, [queryClient])

  const handleUpdatedChat = useCallback(
    ({ conversation, updateReasons }: { conversation: Conversation; updateReasons: string[] }) => {
      const relevantUpdates = ['attributes', 'friendlyName']
      const shouldUpdate = updateReasons.some((reason) => relevantUpdates.includes(reason))
      if (!shouldUpdate) return

      const newCovo = Object.create(conversation)
      queryClient.setQueryData([ACTIVE_CHAT_QUERY, chatId], newCovo)
    },
    [chatId, queryClient],
  )

  useEffect(() => {
    if (chat) {
      chat.on('messageAdded', handleMessageAdded)
      // chat.on('messageRemoved', handleMessageRemoved)
      // chat.on('typingStarted', handleTyping)
      // chat.on('typingEnded', handleRemoveTyping)
      // chat.on('removed', handleChatRemoved)
      // chat.on('participantJoined', handleParticipantJoined)
      // chat.on('participantLeft', handleParticipantLeft)
      // chat.on('participantUpdated', handleUpdatedParticipant)
      // chat.on('messageUpdated', handleUpdatedMessage)
      chat.on('updated', handleUpdatedChat)
    }

    return () => {
      if (chat) {
        chat.removeListener('messageAdded', handleMessageAdded)
        // chat.removeListener('messageRemoved', handleMessageRemoved)
        // chat.removeListener('typingStarted', handleTyping)
        // chat.removeListener('typingEnded', handleRemoveTyping)
        // chat.removeListener('removed', handleChatRemoved)
        // chat.removeListener('participantJoined', handleParticipantJoined)
        // chat.removeListener('participantLeft', handleParticipantLeft)
        // chat.removeListener('participantUpdated', handleUpdatedParticipant)
        // chat.removeListener('messageUpdated', handleUpdatedMessage)
        chat.removeListener('updated', handleUpdatedChat)
      }
    }
  }, [chat, handleUpdatedChat, handleMessageAdded])

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
