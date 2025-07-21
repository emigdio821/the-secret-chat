'use client'

import { useId, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Message } from '@twilio/conversations'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { editMessageSchema } from '@/lib/zod-schemas/form/form.schema'
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
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'

interface EditProfileDialogProps {
  message: Message
  trigger: React.ReactNode
}

export function EditMessageDialog({ message, trigger }: EditProfileDialogProps) {
  const editMessageFormId = useId()
  const [openDialog, setOpenDialog] = useState(false)
  const form = useForm<z.infer<typeof editMessageSchema>>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: {
      body: message.body ?? '',
    },
  })

  async function onSubmit(values: z.infer<typeof editMessageSchema>) {
    try {
      await message.updateBody(values.body)
      await message.updateAttributes({ isEdited: true })
      form.reset(values)
      setOpenDialog(false)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[edit_chat_message]', errMsg)

      toast.error('Error', {
        description: 'Unable to edit the message at this time, try again.',
      })
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="space-y-0">
          <DialogTitle>Edit message</DialogTitle>
          <DialogDescription className="sr-only">Edit your message here.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id={editMessageFormId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="body"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message body</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" placeholder={message.body ?? ''} {...field} />
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
          <Button type="submit" form={editMessageFormId} disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
            {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
