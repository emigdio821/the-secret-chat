import { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Conversation } from '@twilio/conversations'
import { AnimatePresence } from 'framer-motion'
import { Ghost, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import type * as z from 'zod'

import { ACTIVE_CHAT_MESSAGES_QUERY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { sendMessageSchema } from '@/lib/zod-schemas'
import { useRainbowGradient } from '@/hooks/use-rainbow-gradient'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'

import { ChatOnlySkeleton } from './chat-seketon'
import MessageItem from './message-item'
import { ChatParticipants } from './participants'
import { TypingIndicator } from './typing-indicator'

interface MessagesProps {
  chat: Conversation
}

export function Messages({ chat }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const containerBg = useRainbowGradient()
  const usersTyping = useStore((state) => state.usersTyping)
  const {
    data: messages,
    isLoading,
    refetch,
  } = useQuery([ACTIVE_CHAT_MESSAGES_QUERY, chat.sid], getMessages)
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: '',
    },
  })

  async function getMessages() {
    try {
      const messages = await chat.getMessages()
      return messages.items
    } catch (err) {
      console.error('[GET_MESSAGES]', err)
    }
  }

  async function handleUserTyping(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') {
      await chat.typing()
    }
  }

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    try {
      await chat.sendMessage(values.message)
      await refetch()
      form.reset()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[ACTIVE_CHAT_SEND_MSG]', errMsg)

      toast({
        title: 'Uh oh!',
        description: 'Something went wrong while sending the message, try again',
      })
    }
  }

  useEffect(() => {
    const messagesEndEl = messagesEndRef.current

    if (messagesEndEl) {
      messagesEndEl.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <>
      {isLoading ? (
        <ChatOnlySkeleton />
      ) : (
        <>
          {messages && session && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <ChatParticipants chat={chat} session={session} />
                <ScrollArea
                  style={{ background: containerBg }}
                  className="relative h-96 w-full rounded-lg border sm:h-[420px]"
                >
                  {messages.length > 0 ? (
                    <div className="flex flex-col gap-2 p-4">
                      {messages.map((message) => (
                        <MessageItem key={message.sid} session={session} message={message} />
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm">
                      <Ghost className="h-5 w-5" />
                      No messages yet
                    </div>
                  )}
                  <AnimatePresence>
                    {usersTyping.length > 0 && <TypingIndicator participants={usersTyping} />}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col items-center gap-2 sm:flex-row"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormControl>
                          <Input
                            autoComplete="false"
                            onKeyDown={handleUserTyping}
                            placeholder="Type your message"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    size="icon"
                    type="submit"
                    className="w-full self-start sm:w-10"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </>
      )}
    </>
  )
}