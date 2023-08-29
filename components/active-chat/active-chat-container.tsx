import { useCallback, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { type Client } from '@twilio/conversations'
import { Home } from 'lucide-react'
import { useQuery, useQueryClient } from 'react-query'

import { ACTIVE_CHAT_MESSAGES_QUERY, ACTIVE_CHAT_QUERY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { FullChatSkeleton } from '@/components/active-chat/chat-seketon'
import { Messages } from '@/components/active-chat/messages'

import ChatActions from './chat-actions'

interface ConvoDescription {
  description?: string
}

interface ActiveChatContainerProps {
  client: Client
  chatId: string
}

export function ActiveChatContainer({ client, chatId }: ActiveChatContainerProps) {
  const { data: chat, isLoading } = useQuery([ACTIVE_CHAT_QUERY, chatId], getCurrentChat)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const addUsersTyping = useStore((state) => state.addUsersTyping)
  const removeUsersTyping = useStore((state) => state.removeUsersTyping)
  const attrs = chat?.attributes as unknown as ConvoDescription

  async function getCurrentChat() {
    try {
      const chat = await client.getConversationBySid(chatId)
      if (chat.status === 'notParticipating') {
        await chat.join()
      }

      return chat
    } catch (err) {
      console.log('[GET_CURRENT_CHAT]', err)
    }
  }

  const refetchMessages = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: [ACTIVE_CHAT_MESSAGES_QUERY] })
  }, [queryClient])

  const handleChatRemoved = useCallback(() => {
    toast({
      title: 'Info',
      description: 'This chat room was removed by the admin or you were removed from it',
    })
    router.push('/')
  }, [toast, router])

  useEffect(() => {
    if (chat) {
      chat.on('messageAdded', refetchMessages)
      chat.on('typingStarted', addUsersTyping)
      chat.on('typingEnded', removeUsersTyping)
      chat.on('removed', handleChatRemoved)
    }

    return () => {
      if (chat) {
        chat.removeListener('messageAdded', refetchMessages)
        chat.removeListener('typingStarted', addUsersTyping)
        chat.removeListener('typingEnded', removeUsersTyping)
        chat.removeListener('typingEnded', handleChatRemoved)
      }
    }
  }, [addUsersTyping, chat, refetchMessages, removeUsersTyping, handleChatRemoved])

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
                <ChatActions chat={chat} />
              </div>
              <Messages chat={chat} />
            </>
          ) : (
            <Card className="mx-auto max-w-sm">
              <CardHeader>
                <CardTitle>Chat not found</CardTitle>
                <CardDescription>Seems like this chat no longer exists</CardDescription>
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
