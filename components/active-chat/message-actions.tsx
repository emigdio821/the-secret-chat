import { zodResolver } from '@hookform/resolvers/zod'
import { type Message } from '@twilio/conversations'
import { useToggle } from '@uidotdev/usehooks'
import { Edit2, MoreVertical, Save, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type * as z from 'zod'

import { editMessageSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ControlledAlertDialog } from '@/components/controlled-alert-dialog'
import { Loader } from '@/components/icons'

interface MessageActionsProps {
  message: Message
  editMode: boolean
}

export function MessageActions({ message, editMode }: MessageActionsProps) {
  const [openedAlert, setOpenedAlert] = useToggle(false)
  const [isLoading, setLoading] = useToggle(false)
  const [isEditMode, setEditMode] = useToggle(false)
  const form = useForm<z.infer<typeof editMessageSchema>>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: {
      body: message.body ?? '',
    },
  })

  async function handleDeleteMessage() {
    try {
      setLoading(true)
      await message.remove()
      setOpenedAlert(false)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[DELETE_CHAT_MSG]', errMessage)
    } finally {
      setLoading(false)
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
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <span className="sr-only">Chat menu</span>
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        {editMode && (
          <>
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
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </PopoverTrigger>
              <PopoverContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex w-full flex-row items-center gap-2"
                  >
                    <FormField
                      name="body"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              autoComplete="false"
                              placeholder={message.body ?? 'Edit your message'}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      size="icon"
                      type="submit"
                      disabled={form.formState.isSubmitting || !form.formState.isValid}
                    >
                      {form.formState.isSubmitting ? <Loader /> : <Save className="h-4 w-4" />}
                      <span className="sr-only">Save message</span>
                    </Button>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            <DropdownMenuSeparator />
          </>
        )}
        <ControlledAlertDialog
          open={openedAlert}
          isLoading={isLoading}
          setOpen={setOpenedAlert}
          action={handleDeleteMessage}
          trigger={
            <DropdownMenuItem
              className="!text-destructive"
              onSelect={(e) => {
                e.preventDefault()
                setOpenedAlert(true)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          }
          alertMessage="This action cannot be undone. This will permanently delete this message."
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
