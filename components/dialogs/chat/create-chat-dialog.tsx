'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { USER_CHATS_QUERY } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { cn } from '@/lib/utils'
import { createChatRoomSchema } from '@/lib/zod-schemas/form/form.schema'
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'

interface CreateChatDialogProps {
  trigger: React.ReactNode
}

export function CreateChatDialog({ trigger }: CreateChatDialogProps) {
  const router = useRouter()
  const createChatFormId = useId()
  const queryClient = useQueryClient()
  const [openedDialog, setOpenedDialog] = useState(false)
  const client = useTwilioClientStore((state) => state.client)

  const form = useForm<z.infer<typeof createChatRoomSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(createChatRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      join_after: false,
    },
  })

  async function onSubmit(values: z.infer<typeof createChatRoomSchema>) {
    try {
      if (!client) throw new Error('Twilio client is undefined')
      const chat = await client.createConversation({
        uniqueName: values.name,
        friendlyName: values.name,
        attributes: {
          description: values.description || '',
        },
      })

      if (values.join_after) {
        // await chat.join()
        // TODO: Fix get chat when join after is not checked
        const user = await client.getUser(client.user.identity)
        const userAttrs = user.attributes as UserAttributes | undefined

        await chat.add(client.user.identity, {
          nickname: userAttrs?.nickname || user.friendlyName,
          avatar_url: userAttrs?.avatar_url || '',
          name: userAttrs?.name || '',
          about: userAttrs?.about || '',
        })

        router.push(`/chat/${chat.sid}`)
      }

      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
      setOpenedDialog(false)
      form.reset()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.error('[create_chat_dialog]', err)

      const toastMsg =
        errMsg.toLowerCase() === 'conflict'
          ? 'Seems like that chat name already exists, try another one.'
          : 'Unable to create this chat at this moment, try again.'

      toast.error('Error', {
        description: toastMsg,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create chat</DialogTitle>
          <DialogDescription className="sr-only">Create your chat here.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id={createChatFormId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                const charsLength = field.value.length

                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input maxLength={40} {...field} />
                    </FormControl>
                    {charsLength >= 30 && (
                      <p className="text-muted-foreground text-xs">{charsLength} / 40 characters</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => {
                const charsLength = field.value.length

                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={100}
                        className="resize-none"
                        placeholder="Small description of the chat room (optional)"
                        {...field}
                      />
                    </FormControl>
                    {charsLength >= 80 && (
                      <p className="text-muted-foreground text-xs">{charsLength} / 100 characters</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="join_after"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Join after</FormLabel>
                    <FormDescription>Join the chat right after it&apos;s created.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
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
          <Button type="submit" form={createChatFormId} disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
            {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
