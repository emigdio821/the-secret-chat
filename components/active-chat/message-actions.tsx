import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Message } from '@twilio/conversations'
import { Edit2Icon, MoreHorizontalIcon, SmilePlusIcon, Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { editMessageSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { EmojiPicker } from '@/components/emoji-picker'
import { Icons } from '@/components/icons'
import { AlertActionDialog } from '../dialogs/alert-action'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'

interface MessageActionsProps {
  message: Message
  editMode: boolean
}

export function MessageActions({ message, editMode }: MessageActionsProps) {
  const [isEditMode, setEditMode] = useState(false)
  const [openActions, setOpenActions] = useState(false)
  const form = useForm<z.infer<typeof editMessageSchema>>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: {
      body: message.body ?? '',
    },
  })

  async function handleDeleteMessage() {
    try {
      await message.remove()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[delete_chat_msg]', errMessage)
    }
  }

  async function onSubmit(values: z.infer<typeof editMessageSchema>) {
    try {
      await message.updateBody(values.body)
      await message.updateAttributes({ isEdited: true })
      setEditMode(false)
      setOpenActions(false)
      form.reset(values)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[edit_chat_message]', errMsg)

      toast.error('Error', {
        description: 'Unable to edit the message at this time, try again.',
      })
    }
  }

  return (
    <DropdownMenu
      open={openActions}
      onOpenChange={(opened) => {
        if (!opened) {
          setEditMode(false)
        }
        setOpenActions(opened)
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button type="button" aria-label="Message actions" variant="ghost" size="icon" className="size-5">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuLabel>Message actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {editMode && (
          <Popover
            modal
            open={isEditMode}
            onOpenChange={(opened) => {
              if (!opened) {
                form.reset()
              }
              setEditMode(opened)
            }}
          >
            <PopoverTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setEditMode(true)
                }}
              >
                <Edit2Icon className="size-4" />
                Edit
              </DropdownMenuItem>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                  <FormField
                    name="body"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Edit message</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            placeholder={message.body ?? 'Edit your message'}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <EmojiPicker
                      trigger={
                        <Button type="button" size="icon" variant="outline" aria-label="Emoji picker">
                          <SmilePlusIcon className="size-4" />
                        </Button>
                      }
                      callback={(value) => {
                        const body = form.getValues('body')
                        form.setValue('body', `${body}${value.emoji}`, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }}
                    />
                    <Button
                      type="submit"
                      className="grow"
                      disabled={form.formState.isSubmitting || !form.formState.isValid || !form.formState.isDirty}
                    >
                      <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
                      {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        )}
        <AlertActionDialog
          destructive
          title="Delete message?"
          action={async () => {
            await handleDeleteMessage()
            setOpenActions(false)
          }}
          trigger={
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              <Trash2Icon className="size-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
