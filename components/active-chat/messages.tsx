import { useCallback, useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Client, Conversation, Message, Paginator } from '@twilio/conversations'
import { ArrowDown, Ghost, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { ACTIVE_CHAT_MESSAGES_QUERY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { sendMessageSchema } from '@/lib/zod-schemas'
import { useRainbowGradient } from '@/hooks/use-rainbow-gradient'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EmojiPicker } from '@/components/emoji-picker'
import { ChatOnlySkeleton } from '@/components/skeletons'
import { Icons } from '../icons'
import { MediaActions } from './media/media-actions'
import { MessageItem } from './message-item'
import { ChatParticipants } from './participants'
import { TypingIndicator } from './typing-indicator'

interface MessagesProps {
  chat: Conversation
  client: Client
}

export function Messages({ chat, client }: MessagesProps) {
  const { data: session } = useSession()
  const msgsContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollBottom, toggleScrollBtn] = useToggle()
  const [isLoadingPage, toggleLoadingPage] = useToggle()
  const [autoScroll, toggleAutoScroll] = useToggle([true, false])
  const [currentPaginator, setCurrentPaginator] = useState<Paginator<Message>>()
  const containerBg = useRainbowGradient()
  const usersTyping = useStore((state) => state.usersTyping)
  const queryClient = useQueryClient()

  const { data: messages, isLoading } = useQuery({
    queryKey: [ACTIVE_CHAT_MESSAGES_QUERY],
    queryFn: getMessages,
    staleTime: Infinity,
  })
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: '',
    },
  })

  async function getMessages() {
    console.log('fetch running')
    try {
      const paginator = await chat.getMessages()
      const items = paginator.items

      if (items.length > 0) {
        await chat.updateLastReadMessageIndex(items[items.length - 1].index)
      }

      setCurrentPaginator(paginator)

      return paginator
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_MESSAGES]', errMessage)
      return null
    }
  }

  async function handleUserTyping(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') {
      await chat.typing()
    }
  }

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    try {
      form.reset()
      await chat.sendMessage(values.message)
      toggleAutoScroll(true)
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[ACTIVE_CHAT_SEND_MSG]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while sending the message, try again',
      })
    }
  }

  async function handleLoadPage() {
    try {
      toggleLoadingPage(true)
      if (!currentPaginator) throw new Error('Paginator not present')
      const prevPagePaginator = await currentPaginator.prevPage()
      toggleAutoScroll(false)
      setCurrentPaginator(prevPagePaginator)

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
    if (autoScroll) {
      scrollBottom()
    }
  }, [scrollBottom, autoScroll])

  return (
    <>
      {isLoading ? (
        <ChatOnlySkeleton />
      ) : (
        messages?.items &&
        session && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <ChatParticipants chat={chat} session={session} client={client} />
              <div className="relative h-[420px] w-full sm:flex-1">
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
                      toggleAutoScroll(true)
                    }

                    if (!enabledAutoScroll && autoScroll) {
                      toggleAutoScroll(false)
                    }
                  }}
                  style={{ background: containerBg }}
                  className="absolute h-full w-full overflow-y-auto rounded-lg border"
                >
                  {messages.items.length > 0 ? (
                    <div className="flex flex-col gap-2 p-4">
                      {currentPaginator?.hasPrevPage && (
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
                      <Ghost className="h-5 w-5" />
                      No messages yet
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {usersTyping.length > 0 && <TypingIndicator participants={usersTyping} />}
                </AnimatePresence>
                <AnimatePresence>
                  {showScrollBottom && (
                    <motion.button
                      type="button"
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 5 }}
                      exit={{ opacity: 0, y: 5 }}
                      onClick={scrollBottom}
                      className={cn(buttonVariants({ size: 'icon' }), 'absolute right-4 bottom-4 h-6 w-6 rounded-full')}
                    >
                      <ArrowDown className="h-3 w-3" />
                      <span className="sr-only">Scroll bottom</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-row items-center gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <div className="relative">
                        <div className="absolute right-3 flex h-full gap-1">
                          <span className="flex h-full items-center justify-center">
                            <MediaActions chat={chat} />
                          </span>
                          <span className="flex h-full items-center justify-center">
                            <EmojiPicker
                              callback={(emoji) => {
                                if (field.value) {
                                  form.setValue('message', `${field.value}${emoji.native}`, {
                                    shouldValidate: true,
                                  })
                                } else {
                                  form.setValue('message', emoji.native, {
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            />
                          </span>
                        </div>
                        <FormControl>
                          <Input
                            className="pr-12"
                            autoComplete="false"
                            onKeyDown={handleUserTyping}
                            placeholder="Type your message"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <Button size="icon" type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </Form>
          </div>
        )
      )}
    </>
  )
}
