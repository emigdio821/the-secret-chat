'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Client } from '@twilio/conversations'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { USER_CHATS_QUERY } from '@/lib/constants'
import { createChatRoomSchema } from '@/lib/zod-schemas'
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'

interface CreateChatDialogProps {
  isLoading: boolean
  client: Client
}

export function CreateChatDialog({ isLoading, client }: CreateChatDialogProps) {
  const queryClient = useQueryClient()
  const [openedDialog, setOpenedDialog] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof createChatRoomSchema>>({
    resolver: zodResolver(createChatRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      join_after: false,
    },
  })

  async function onSubmit(values: z.infer<typeof createChatRoomSchema>) {
    try {
      const chat = await client.createConversation({
        uniqueName: values.name,
        friendlyName: values.name,
        attributes: {
          description: values.description || '',
        },
      })

      if (values.join_after && chat) {
        // await chat.join()
        const user = await client.getUser(client.user.identity)
        const userAttrs = user.attributes as UserAttributes
        await chat.add(client.user.identity, {
          nickname: user.friendlyName,
          avatar_url: userAttrs?.avatar_url || '',
          name: userAttrs?.name || '',
        })
        router.push(`/chat/${chat.sid}?name=${chat.friendlyName ?? chat.uniqueName}`)
      }

      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
      setOpenedDialog(false)
      form.reset()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[CREATE_CHAT_DIALOG]', errMsg)
      const toastMsg =
        errMsg.toLowerCase() === 'conflict'
          ? 'Seems like that chat name already exists, try another one'
          : 'Something went wrong while creating the chat room, try again'

      toast.error('Uh oh!', {
        description: toastMsg,
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
          Create chat
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Create chat</DialogTitle>
          <DialogDescription>Create a new chat room.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                const charsLength = field.value.length

                return (
                  <FormItem>
                    <FormControl>
                      <Input maxLength={40} autoComplete="false" placeholder="Chat name" {...field} />
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
              control={form.control}
              name="description"
              render={({ field }) => {
                const charsLength = field.value.length

                return (
                  <FormItem>
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
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create
                {form.formState.isSubmitting && <Icons.Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
