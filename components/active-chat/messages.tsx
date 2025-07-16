import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation, Message, Paginator } from '@twilio/conversations'
import { throttle } from 'lodash'
import { ArrowDownIcon, GhostIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { ACTIVE_CHAT_MESSAGES_QUERY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { useChatAutoScrollStore } from '@/lib/stores/chat-autoscroll.store'
import { useChatMessages } from '@/hooks/chat/use-chat-messages'
import { Button } from '@/components/ui/button'
import { Icons } from '../icons'
import { Loader } from '../loader'
import { ActiveChatBottomActions } from './bottom-actions'
import { MessageItem } from './message-item'
import { TypingIndicator } from './typing-indicator'

interface MessagesProps {
  chat: Conversation
}

export function Messages({ chat }: MessagesProps) {
  const { data: session } = useSession()
  const msgsContainerRef = useRef<HTMLDivElement>(null)
  const autoScroll = useChatAutoScrollStore((state) => state.autoScroll)
  const setAutoScroll = useChatAutoScrollStore((state) => state.setAutoScroll)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const { data: messages, isLoading } = useChatMessages(chat)
  const usersTyping = useStore((state) => state.usersTyping)
  const queryClient = useQueryClient()

  const handleLoadPage = useCallback(async () => {
    try {
      setIsLoadingPage(true)
      if (!messages) throw new Error('Paginator not present')
      const prevPagePaginator = await messages.prevPage()
      setAutoScroll(false)

      queryClient.setQueryData([ACTIVE_CHAT_MESSAGES_QUERY], (prev: Paginator<Message>) => {
        return {
          ...prev,
          items: [...prevPagePaginator.items, ...prev.items],
        }
      })
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[FETCH_PREV_PAGE]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while loading previous messages, try again',
      })
    } finally {
      setIsLoadingPage(false)
    }
  }, [messages, queryClient, setAutoScroll])

  const scrollBottom = useCallback(() => {
    const el = msgsContainerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  const handleScroll = useCallback(() => {
    const container = msgsContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const scrollBottomPosition = scrollTop + clientHeight

    const isBelowHalf = scrollBottomPosition < scrollHeight * 0.85
    setShowScrollBottom(isBelowHalf)

    const atBottom = scrollBottomPosition >= scrollHeight
    if (atBottom && !autoScroll) setAutoScroll(true)
    else if (!atBottom && autoScroll) setAutoScroll(false)
  }, [autoScroll, setAutoScroll])

  const throttledScroll = useMemo(() => throttle(handleScroll, 300), [handleScroll])

  useEffect(() => {
    if (autoScroll && messages?.items.length) {
      scrollBottom()
    }
  }, [scrollBottom, autoScroll, messages?.items])

  if (isLoading) {
    return <Loader msg="Retrieving chat messages..." />
  }

  return (
    <>
      {messages?.items && session && (
        <div className="flex h-full flex-col gap-4">
          {/* <ChatParticipants chat={chat} session={session} client={client} /> */}
          <div className="relative h-full w-full">
            <div
              ref={msgsContainerRef}
              onScroll={throttledScroll}
              className="absolute h-full w-full overflow-y-auto rounded-lg shadow-xs"
            >
              {messages.items.length > 0 ? (
                <div className="flex flex-col gap-2 p-4">
                  {messages?.hasPrevPage && (
                    <Button
                      variant="link"
                      disabled={isLoadingPage}
                      className="self-end p-0"
                      onClick={async () => {
                        await handleLoadPage()
                      }}
                    >
                      Load more messages
                      {isLoadingPage && <Icons.Spinner className="size-4" />}
                    </Button>
                  )}
                  {messages.items.map((message) => (
                    <MessageItem key={message.sid} session={session} message={message} />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm">
                  <GhostIcon className="size-5" />
                  No messages yet
                </div>
              )}
            </div>

            <AnimatePresence>
              {usersTyping.length > 0 && <TypingIndicator participants={usersTyping} />}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {showScrollBottom && (
                <Button size="icon" className="absolute right-4 bottom-4 size-6 transition-colors" asChild>
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
      )}
    </>
  )
}
