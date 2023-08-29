import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Conversation } from '@twilio/conversations'
import { Loader2, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

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
import { toast } from '@/components/ui/use-toast'

export function AddParticipantDialog({ chat }: { chat: Conversation }) {
  const [openedDialog, setOpenedDialog] = useState(false)

  const form = useForm<z.infer<typeof addParticipantSchema>>({
    resolver: zodResolver(addParticipantSchema),
    defaultValues: {
      id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof addParticipantSchema>) {
    try {
      await chat.add(values.id)
      setOpenedDialog(false)
      form.reset()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[ADD_PARTICIPANT_DIALOG]', errMsg)
      toast({
        title: 'Uh oh!',
        description:
          'Something went wrong while adding the participant, please check the id (email) and try again',
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
          <UserPlus className="mr-2 h-4 w-4" />
          Add participant
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
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
                      <Input
                        maxLength={40}
                        autoComplete="false"
                        placeholder="Participant id (email)"
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
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Add
                {form.formState.isSubmitting ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
