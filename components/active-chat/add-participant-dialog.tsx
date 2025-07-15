import { useState } from 'react'
import type { UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Client, Conversation } from '@twilio/conversations'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { addParticipantSchema } from '@/lib/zod-schemas'
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'

interface AddParticipantDialogProps {
  chat: Conversation
  client: Client
}

export function AddParticipantDialog({ chat, client }: AddParticipantDialogProps) {
  const [openedDialog, setOpenedDialog] = useState(false)
  const form = useForm<z.infer<typeof addParticipantSchema>>({
    resolver: zodResolver(addParticipantSchema),
    defaultValues: {
      id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof addParticipantSchema>) {
    try {
      const user = await client.getUser(values.id)
      const userAttrs = user.attributes as UserAttributes
      await chat.add(values.id, {
        nickname: user.friendlyName,
        avatar_url: userAttrs.avatar_url || '',
        name: userAttrs?.name || '',
      })
      setOpenedDialog(false)
      form.reset()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[ADD_PARTICIPANT_DIALOG]', errMsg)
      toast.error('Uh oh!', {
        description: 'Something went wrong while adding the participant, please check the id (email) and try again',
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
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setOpenedDialog(true)
          }}
        >
          <UserPlus className="mr-2 size-4" />
          Add participant
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Add participant</DialogTitle>
          <DialogDescription>Add a new participant to this chat room.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              name="id"
              control={form.control}
              render={({ field }) => {
                const charsLength = field.value.length

                return (
                  <FormItem>
                    <FormControl>
                      <Input maxLength={40} autoComplete="false" placeholder="Participant id (email)" {...field} />
                    </FormControl>
                    {charsLength >= 30 && (
                      <p className="text-muted-foreground text-xs">{charsLength} / 40 characters</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Add
                {form.formState.isSubmitting ? (
                  <Icons.Spinner className="ml-2" />
                ) : (
                  <UserPlus className="ml-2 size-4" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
