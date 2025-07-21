'use client'

import { useId, useState } from 'react'
import type { ChatAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Conversation } from '@twilio/conversations'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { editChatSchema } from '@/lib/zod-schemas/form/form.schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'
import { GifPickerDialog } from '../gif-picker-dialog'

interface EditProfileDialogProps {
  chat: Conversation
  trigger: React.ReactNode
}

export function EditChatDialog({ chat, trigger }: EditProfileDialogProps) {
  const updateProfileFormId = useId()
  const [openDialog, setOpenDialog] = useState(false)
  const chatAttrs = chat.attributes as ChatAttributes | undefined

  const form = useForm<z.infer<typeof editChatSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(editChatSchema),
    defaultValues: {
      friendlyName: chat.friendlyName ?? '',
      chatLogoUrl: chatAttrs?.chatLogoUrl ?? '',
      description: chatAttrs?.description ?? '',
    },
  })

  async function onSubmit(values: z.infer<typeof editChatSchema>) {
    try {
      const attributes: ChatAttributes = {
        chatLogoUrl: values.chatLogoUrl,
        description: values.description,
      }
      await chat.updateFriendlyName(values.friendlyName)
      await chat.updateUniqueName(values.friendlyName)
      await chat.updateAttributes(attributes)

      form.reset(values)
      setOpenDialog(false)
      toast.success('Success', { description: 'Chat has been updated.' })
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[edit_chat_dialog]', errMessage)
      toast.error('Unable to update the chat at this time, try again.')
    }
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-0">
          <DialogTitle>Edit chat</DialogTitle>
          <DialogDescription className="sr-only">Edit your chat here.</DialogDescription>
        </DialogHeader>

        <Avatar className="my-2 size-16">
          <AvatarImage src={form.getValues('chatLogoUrl') || chatAttrs?.chatLogoUrl} />
          <AvatarFallback className="bg-highlight" />
        </Avatar>
        <Form {...form}>
          <form id={updateProfileFormId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="chatLogoUrl"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormDescription>Copy and pase the URL of the desired image.</FormDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input className="grow" {...field} />
                    </FormControl>
                    <GifPickerDialog
                      onSelect={(url) => {
                        form.setValue('chatLogoUrl', url)
                      }}
                      trigger={<Button variant="outline">GIF</Button>}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="friendlyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chat name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chat description</FormLabel>
                  <FormControl>
                    <Textarea
                      maxLength={100}
                      className="resize-none"
                      placeholder="Small description of the chat room (optional)"
                      {...field}
                    />
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
          <Button type="submit" form={updateProfileFormId} disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
            {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
