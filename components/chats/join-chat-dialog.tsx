'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Client } from '@twilio/conversations'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { joinChatRoomSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'

interface JoinChatDialogProps {
  isLoading: boolean
  client: Client
}

export function JoinChatDialog({ client }: JoinChatDialogProps) {
  const [openedDialog, setOpenedDialog] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof joinChatRoomSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(joinChatRoomSchema),
    defaultValues: {
      id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof joinChatRoomSchema>) {
    try {
      const chat = await client?.getConversationByUniqueName(values.id)

      if (chat?.status === 'notParticipating') {
        await chat?.join()
      }

      if (chat) {
        router.push(`/chat/${chat.sid}?name=${chat.friendlyName ?? chat.uniqueName}`)
      }

      setOpenedDialog(false)
      form.reset()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[JOIN_CHAT_DIALOG]', errMsg)

      toast.error('Uh oh!', {
        description: "Seems like the chat room doesn't exist or you don't have access to it",
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
      <DialogTrigger asChild>
        <Button type="button" disabled>
          Join chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join chat</DialogTitle>
          <DialogDescription>Join an existing chat room</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Chat id" autoComplete="false" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Join
                {form.formState.isSubmitting && <Icons.Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
