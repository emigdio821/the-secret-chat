'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessagesSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type * as z from 'zod'

import { useStore } from '@/lib/store'
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
import { Loader } from '@/components/icons'

export function JoinChatDialog({ isLoading }: { isLoading: boolean }) {
  const [openedDialog, setOpenedDialog] = useState(false)
  const client = useStore((state) => state.client)
  const addChat = useStore((state) => state.addConversation)
  const router = useRouter()

  const form = useForm<z.infer<typeof joinChatRoomSchema>>({
    resolver: zodResolver(joinChatRoomSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof joinChatRoomSchema>) {
    try {
      const chat = await client?.getConversationByUniqueName(values.name)

      if (chat?.status === 'notParticipating') {
        await chat?.join()
      }

      if (chat) {
        addChat(chat)
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
        if (!opened) {
          form.reset()
        }
        setOpenedDialog(opened)
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" disabled={isLoading}>
          Join chat
          <MessagesSquare className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Join chat</DialogTitle>
          <DialogDescription>Join an existing chat room</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Chat name" autoComplete="false" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Join
                {form.formState.isSubmitting ? (
                  <Loader className="ml-2" />
                ) : (
                  <MessagesSquare className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
