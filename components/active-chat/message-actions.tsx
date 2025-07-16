import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@mantine/hooks'
import type { Message } from '@twilio/conversations'
import { Edit2Icon, MoreHorizontalIcon, SmilePlusIcon, Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
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
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { EmojiPicker } from '@/components/emoji-picker'
import { Icons } from '@/components/icons'
import { AlertActionDialog } from '../dialogs/alert-action'

interface MessageActionsProps {
  message: Message
  editMode: boolean
}

export function MessageActions({ message, editMode }: MessageActionsProps) {
  const [isEditMode, setEditMode] = useToggle()
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
      console.log('[delete_chat_msg]', errMessage)
    }
  }

  async function onSubmit(values: z.infer<typeof editMessageSchema>) {
    try {
      await message.updateBody(values.body)
      await message.updateAttributes({ isEdited: true })
      setEditMode(false)
      form.reset(values)
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[EDIT_CHAT_MSG]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while editing your message, try again',
      })
    }
  }

  return (
    <DropdownMenu
      onOpenChange={(opened) => {
        if (!opened) {
          setEditMode(false)
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button aria-label="Message actions" variant="ghost" size="icon" className="size-5">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuLabel>Message actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {editMode && (
          <Popover
            modal={true}
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
                <Label>Edit message</Label>
                <Textarea
                  autoComplete="false"
                  className="resize-none"
                  defaultValue={message.body ?? ''}
                  placeholder={message.body ?? 'Edit your message'}
                  {...form.register('body')}
                />
                <div className="flex items-center justify-end gap-2">
                  <EmojiPicker
                    trigger={
                      <Button size="icon" variant="ghost" aria-label="Emoji picker">
                        <SmilePlusIcon className="size-4" />
                      </Button>
                    }
                    callback={(value) => {
                      const body = form.getValues('body')
                      form.setValue('body', `${body}${value.emoji}`, {
                        shouldValidate: true,
                      })
                    }}
                  />
                  <Button
                    className="self-end"
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isValid || !form.formState.isDirty}
                  >
                    Save
                    {form.formState.isSubmitting && <Icons.Spinner className="ml-2" />}
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        )}
        <AlertActionDialog
          destructive
          title="Delete message?"
          action={async () => handleDeleteMessage()}
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
