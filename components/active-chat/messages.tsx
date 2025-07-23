import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { throttle } from 'lodash'
import { ArrowDownIcon, BugIcon, RotateCwIcon, WindIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { UNREAD_CHAT_MSGS_QUERY, USER_CHATS_QUERY } from '@/lib/constants'
import { useChatAutoScrollStore } from '@/lib/stores/chat-autoscroll.store'
import { useTypingParticipantsStore } from '@/lib/stores/typing-participants.store'
import { useChatMessages } from '@/hooks/chat/use-chat-messages'
import { Button } from '@/components/ui/button'
import { Icons } from '../icons'
import { Loader } from '../loader'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { TypographyH4 } from '../ui/typography'
import { ActiveChatBottomActions } from './bottom-actions'
import { MessageItem } from './message-item'
import { TypingIndicator } from './typing-indicator'

interface MessagesProps {
  chat: Conversation
}

export function Messages({ chat }: MessagesProps) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const msgsContainerRef = useRef<HTMLDivElement>(null)
  const suppressScrollRef = useRef(false)
  const autoScroll = useChatAutoScrollStore((state) => state.autoScroll)
  const setAutoScroll = useChatAutoScrollStore((state) => state.setAutoScroll)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const {
    data: queryMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useChatMessages(chat)

  const typingParticipants = useTypingParticipantsStore((state) => state.typingParticipants)
  const messages =
    queryMessages?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.items) ?? []

  const handleFetchOlderMessages = useCallback(async () => {
    const container = msgsContainerRef.current
    if (!container) return

    try {
      const prevScrollHeight = container.scrollHeight
      const prevScrollTop = container.scrollTop

      await fetchNextPage()

      // Wait for DOM update before restoring scroll
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight
        container.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop
      })
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[fetch_more_messages]', errMsg)

      toast.error('Error', {
        description: 'Unable to fetch more messages at this time, try again.',
      })
    }
  }, [fetchNextPage])

  const scrollBottom = useCallback(() => {
    const el = msgsContainerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  const handleScroll = useCallback(async () => {
    if (suppressScrollRef.current) return

    const container = msgsContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const scrollBottomPosition = scrollTop + clientHeight

    const isBelowHalf = scrollBottomPosition < scrollHeight * 0.85
    setShowScrollBottom(isBelowHalf)

    const atBottom = scrollBottomPosition >= scrollHeight
    if (atBottom && !autoScroll) setAutoScroll(true)
    else if (!atBottom && autoScroll) setAutoScroll(false)

    if (container.scrollTop <= 450 && !isFetchingNextPage && hasNextPage) {
      await handleFetchOlderMessages()
    }
  }, [autoScroll, setAutoScroll, handleFetchOlderMessages, hasNextPage, isFetchingNextPage])

  const throttledScroll = useMemo(() => throttle(handleScroll, 300), [handleScroll])

  const handleAfterLoadMessages = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [UNREAD_CHAT_MSGS_QUERY, chat.sid] })
  }, [queryClient, chat.sid])

  useEffect(() => {
    if (autoScroll && messages?.length) {
      const el = msgsContainerRef.current
      if (el) {
        suppressScrollRef.current = true
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })

        setTimeout(() => {
          suppressScrollRef.current = false
        }, 400)
      }
    }
  }, [autoScroll, messages])

  useEffect(() => {
    if (queryMessages) {
      handleAfterLoadMessages()
    }
  }, [handleAfterLoadMessages, queryMessages])

  if (isLoading) {
    return <Loader msg="Retrieving chat messages..." />
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription className="text-center">Something went wrong while fetching the messages.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RotateCwIcon className="size-4" />
            Refetch messages
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative h-full w-full overflow-hidden rounded-lg border">
        <div
          ref={msgsContainerRef}
          onScroll={throttledScroll}
          className="absolute h-full w-full overflow-y-auto rounded-lg"
        >
          {messages.length > 0 ? (
            <div className="flex flex-col gap-2 p-4">
              {hasNextPage && (
                <Button
                  type="button"
                  variant="outline"
                  className="self-end"
                  disabled={isFetchingNextPage}
                  onClick={handleFetchOlderMessages}
                >
                  {isFetchingNextPage ? 'Fetching older messages...' : 'Load more messages'}
                  {isFetchingNextPage && <Icons.Spinner className="size-4" />}
                </Button>
              )}
              <AnimatePresence initial={false}>
                {session &&
                  messages.map((message) => <MessageItem key={message.sid} session={session} message={message} />)}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <WindIcon className="text-muted-foreground size-12" />
              <span className="text-muted-foreground text-sm">This conversation is empty</span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {typingParticipants.length > 0 && <TypingIndicator participants={typingParticipants} />}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {showScrollBottom && (
            <Button type="button" size="icon" className="absolute right-4 bottom-4 size-6 transition-colors" asChild>
              <motion.button
                type="button"
                onClick={scrollBottom}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -5, opacity: 0 }}
              >
                <ArrowDownIcon className="size-3" />
                <span className="sr-only">Scroll bottom</span>
              </motion.button>
            </Button>
          )}
        </AnimatePresence>
      </div>
      <ActiveChatBottomActions chat={chat} />
    </div>
  )
}
