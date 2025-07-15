import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation, Message, Paginator } from '@twilio/conversations'
import { ArrowDownIcon, GhostIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { ACTIVE_CHAT_MESSAGES_QUERY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { useChatAutoScrollStore } from '@/lib/stores/chat-autoscroll.store'
import { useChatMessages } from '@/hooks/chat/use-chat-messages'
import { Button } from '@/components/ui/button'
import { ChatOnlySkeleton } from '@/components/skeletons'
import { Icons } from '../icons'
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
  const [isLoadingPage, toggleLoadingPage] = useState(false)
  const [showScrollBottom, toggleScrollBtn] = useState(false)
  const { data: messages, isLoading } = useChatMessages(chat)
  const usersTyping = useStore((state) => state.usersTyping)
  const queryClient = useQueryClient()

  async function handleLoadPage() {
    try {
      toggleLoadingPage(true)
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
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[FETCH_PREV_PAGE]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while sending the message, try again',
      })
    } finally {
      toggleLoadingPage(false)
    }
  }

  const scrollBottom = useCallback(() => {
    const msgsContainerEl = msgsContainerRef.current

    if (msgsContainerEl) {
      msgsContainerEl.scrollTo({ top: msgsContainerEl.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (autoScroll && messages) {
      scrollBottom()
    }
  }, [scrollBottom, autoScroll, messages])

  return (
    <>
      {isLoading ? (
        <ChatOnlySkeleton />
      ) : (
        messages?.items &&
        session && (
          <div className="flex h-full flex-col gap-4">
            {/* <ChatParticipants chat={chat} session={session} client={client} /> */}
            <div className="relative h-full w-full">
              <div
                ref={msgsContainerRef}
                onScroll={(e) => {
                  const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
                  const stDiv = scrollTop + clientHeight
                  const enabledAutoScroll = stDiv === scrollHeight

                  if (stDiv < (scrollHeight * 6) / 7 && !showScrollBottom) {
                    toggleScrollBtn(true)
                  }

                  if (scrollHeight === stDiv || (stDiv >= (scrollHeight * 6) / 7 && showScrollBottom)) {
                    toggleScrollBtn(false)
                  }

                  if (enabledAutoScroll && !autoScroll) {
                    setAutoScroll(true)
                  }

                  if (!enabledAutoScroll && autoScroll) {
                    setAutoScroll(false)
                  }
                }}
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
              <AnimatePresence>
                {showScrollBottom && (
                  <Button size="icon" className="absolute right-4 bottom-4 size-6" asChild>
                    <motion.button
                      type="button"
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: -5 }}
                      exit={{ opacity: 0, y: -5 }}
                      onClick={scrollBottom}
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
      )}
    </>
  )
}
