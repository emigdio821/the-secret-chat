import { zodResolver } from '@hookform/resolvers/zod'
import type { Conversation } from '@twilio/conversations'
import { SendIcon, SmilePlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { useChatAutoScrollStore } from '@/lib/stores/chat-autoscroll.store'
import { sendMessageSchema } from '@/lib/zod-schemas'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EmojiPicker } from '../emoji-picker'
import { Button } from '../ui/button'
import { MediaActions } from './media/media-actions'

export function ActiveChatBottomActions({ chat }: { chat: Conversation }) {
  const setAutoScroll = useChatAutoScrollStore((state) => state.setAutoScroll)
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: '',
    },
  })

  async function handleUserTyping(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') {
      await chat.typing()
    }
  }

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    try {
      await chat.sendMessage(values.message)
      setAutoScroll(true)
      form.reset()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[send_message]', errMsg)

      toast.error('Error', {
        description: 'Unable to send the message at this time, try again.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-row items-center gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  autoComplete="false"
                  aria-invalid="false"
                  onKeyDown={handleUserTyping}
                  placeholder="Type your message"
                  {...field}
                >
                  <div className="absolute inset-y-0 end-0 flex h-full">
                    <MediaActions chat={chat} />
                    <EmojiPicker
                      trigger={
                        <Button
                          type="button"
                          size="icon"
                          variant="unstyled"
                          aria-label="Emoji picker"
                          className="text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
                        >
                          <SmilePlusIcon className="size-4" />
                        </Button>
                      }
                      callback={(value) => {
                        form.setValue('message', `${field.value}${value.emoji}`, {
                          shouldValidate: true,
                        })
                      }}
                    />
                  </div>
                </Input>
              </FormControl>
            </FormItem>
          )}
        />
        <Button size="icon" type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
          <SendIcon className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </Form>
  )
}
