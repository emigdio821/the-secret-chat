'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { cn } from '@/lib/utils'
import { joinChatRoomSchema } from '@/lib/zod-schemas/form/form.schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'

interface JoinChatDialogProps {
  trigger: React.ReactNode
}

export function JoinChatDialog({ trigger }: JoinChatDialogProps) {
  const router = useRouter()
  const joinChatFormId = useId()
  const [openedDialog, setOpenedDialog] = useState(false)
  const client = useTwilioClientStore((state) => state.client)

  const form = useForm<z.infer<typeof joinChatRoomSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(joinChatRoomSchema),
    defaultValues: {
      id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof joinChatRoomSchema>) {
    try {
      if (!client) throw new Error('Twilio client is undefined')
      const chat = await client.getConversationByUniqueName(values.id)

      if (chat.status === 'joined') {
        toast.info('Info', {
          description: 'You are already a member of this chat.',
        })

        return
      }

      if (chat.status === 'notParticipating') {
        await chat?.join()
      }

      router.push(`/chat/${chat.sid}`)
      setOpenedDialog(false)
      form.reset()
    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : err
      console.error('[join_chat_dialog]', errMsg)

      toast.error('Error', {
        description: 'Seems like the chat room does not exist, or you do not have access to it.',
      })
    }
  }

  return (
    <Dialog
      open={openedDialog}
      onOpenChange={(opened) => {
        if (form.formState.isSubmitting) return
        setOpenedDialog(opened)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Join chat</DialogTitle>
          <DialogDescription className="sr-only">Join an existing chat using the chat id.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id={joinChatFormId} className="space-y-4">
            <FormField
              name="id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chat ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form={joinChatFormId} disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Join</span>
            {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
