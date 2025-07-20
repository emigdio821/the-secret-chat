import { useState } from 'react'
import type { UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { ACTIVE_PARTICIPANTS_QUERY } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { cn } from '@/lib/utils'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'

interface AddParticipantDialogProps {
  chat: Conversation
  trigger: React.ReactNode
}

export function AddParticipantDialog({ chat, trigger }: AddParticipantDialogProps) {
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)
  const client = useTwilioClientStore((state) => state.client)
  const form = useForm<z.infer<typeof addParticipantSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(addParticipantSchema),
    defaultValues: {
      id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof addParticipantSchema>) {
    try {
      if (!client) throw new Error('Twilio client is undefined')

      const user = await client.getUser(values.id)
      const userAttrs = user.attributes as UserAttributes | undefined
      await chat.add(values.id, {
        nickname: user.friendlyName,
        avatar_url: userAttrs?.avatar_url || '',
        name: userAttrs?.name || '',
      })

      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
      setOpenDialog(false)
      form.reset()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[add_participant_dialog]', errMsg)

      toast.error('Error', {
        description: 'Unable to add this participant, please check the ID and try again.',
      })
    }
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(opened) => {
        if (form.formState.isSubmitting) return
        setOpenDialog(opened)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add participant</DialogTitle>
          <DialogDescription>Add a new participant to this chat.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              name="id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <span className={cn(form.formState.isSubmitting && 'invisible')}>Add</span>
                {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
