'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MessageSquarePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import type * as z from 'zod'

import { useStore } from '@/lib/store'
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

export function CreateChatDialog({ isLoading }: { isLoading: boolean }) {
  const queryClient = useQueryClient()
  const [openedDialog, setOpenedDialog] = useState(false)
  const client = useStore((state) => state.client)
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
      const chat = await client?.createConversation({
        uniqueName: values.name,
        friendlyName: values.name,
        attributes: {
          description: values.description || '',
        },
      })

      if (values.join_after && chat) {
        await chat.join()
        router.push(`/chats/${chat.sid}`)
      }

      await queryClient.refetchQueries({ queryKey: ['chats'] })
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

      toast({
        title: 'Uh oh!',
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
          <MessageSquarePlus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
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
                      <Input
                        maxLength={40}
                        autoComplete="false"
                        placeholder="Chat name"
                        {...field}
                      />
                    </FormControl>
                    {charsLength >= 30 && (
                      <p className="text-xs text-muted-foreground">{charsLength} / 40 characters</p>
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
                      <p className="text-xs text-muted-foreground">
                        {charsLength} / 100 characters
                      </p>
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create
                {form.formState.isSubmitting ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquarePlus className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
