import { zodResolver } from '@hookform/resolvers/zod'
import { type Conversation } from '@twilio/conversations'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import type * as z from 'zod'

import { formatDate } from '@/lib/utils'
import { sendMessageSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

interface MessagesProps {
  chat: Conversation
}

export function Messages({ chat }: MessagesProps) {
  async function getMessages() {
    try {
      const messages = await chat.getMessages()
      return messages.items
    } catch (err) {
      console.error('[GET_MESSAGES]', err)
    }
  }

  const { data: messages, refetch } = useQuery(['active-chat-messages'], getMessages)

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: '',
    },
  })

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

  return (
    <>
      {messages && messages?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-2">
              {messages.map(({ author, sid, body, dateCreated }) => (
                <div
                  key={sid}
                  className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm"
                >
                  {body}
                  <div className="flex flex-col text-[10px] leading-4 text-muted-foreground">
                    <span>{dateCreated && formatDate(dateCreated)}</span>
                    <span>{author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="w-full"
                        autoComplete="false"
                        placeholder="Type your message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="icon"
                type="submit"
                className="min-w-[40px]"
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
  )
}
