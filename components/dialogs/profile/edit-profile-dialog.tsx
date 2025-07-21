'use client'

import { useId, useState } from 'react'
import type { UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation, User } from '@twilio/conversations'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { AVATAR_FALLBACK_URL, USER_PROFILE } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { cn, delay } from '@/lib/utils'
import { editProfileSchema } from '@/lib/zod-schemas/form/form.schema'
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
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'

interface EditProfileDialogProps {
  profile: User
  trigger: React.ReactNode
}

export function EditProfileDialog({ trigger, profile }: EditProfileDialogProps) {
  const editProfileFormId = useId()
  const { data: session } = useSession()
  const user = session?.user
  const [openDialog, setOpenDialog] = useState(false)
  const userAttrs = profile?.attributes as UserAttributes | undefined
  const queryClient = useQueryClient()
  const defaultName = userAttrs?.name || user?.name || ''
  const defaultAbout = userAttrs?.about || ''
  const defaultNickname = userAttrs?.nickname || profile.friendlyName || ''
  const defaultAvatarUrl = userAttrs?.avatar_url || user?.image || AVATAR_FALLBACK_URL
  const client = useTwilioClientStore((state) => state.client)
  const [updateProgress, setUpdateProgress] = useState(0)

  const form = useForm<z.infer<typeof editProfileSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: defaultName,
      about: defaultAbout,
      nickname: defaultNickname,
      avatar_url: defaultAvatarUrl,
    },
  })

  async function updateMyParticipantAttributes(attributes: UserAttributes) {
    if (!client || !client.user) return

    let paginator = await client.getSubscribedConversations()
    const allConversations: Conversation[] = []

    while (paginator) {
      allConversations.push(...paginator.items)

      if (paginator.hasNextPage) {
        paginator = await paginator.nextPage()
      } else {
        break
      }
    }

    const total = allConversations.length
    let completed = 0

    for (const conversation of allConversations) {
      try {
        const participants = await conversation.getParticipants()
        const me = participants.find((p) => p.identity === client.user.identity)
        if (me) {
          await me.updateAttributes(attributes)
          await delay(200)
        }
      } catch (err) {
        console.error(`Error updating participant in conversation ${conversation.sid}`, err)
      } finally {
        completed++
        setUpdateProgress(Math.round((completed / total) * 100))
      }
    }
  }

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    try {
      if (values.nickname) {
        await profile?.updateFriendlyName(values.nickname)
      }

      const attrsPayload: UserAttributes = {
        about: values.about,
        avatar_url: values.avatar_url,
        name: values.name || defaultName,
        nickname: values.nickname || defaultNickname,
      }

      await profile?.updateAttributes(attrsPayload)
      await updateMyParticipantAttributes(attrsPayload)

      queryClient.resetQueries({ queryKey: [USER_PROFILE] })
      setOpenDialog(false)
      form.reset(attrsPayload)
      setUpdateProgress(0)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[edit_profile]', errMsg)
      toast.error('Error', {
        description: 'Unable to update profile at this time, try again.',
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="sr-only">Update your profile here.</DialogDescription>
        </DialogHeader>

        <Avatar className="size-16">
          <AvatarImage src={form.getValues('avatar_url') || defaultAvatarUrl} />
          <AvatarFallback />
        </Avatar>
        <Form {...form}>
          <form id={editProfileFormId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="avatar_url"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormDescription>Copy and pase the URL of the desired image.</FormDescription>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="nickname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="about"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About me</FormLabel>
                  <FormControl>
                    <Textarea maxLength={50} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {updateProgress > 0 && (
          <div>
            <Progress value={updateProgress} />
            <p className="text-muted-foreground mt-2 text-sm">Updating participant attributes... {updateProgress}%</p>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form={editProfileFormId} disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
            {form.formState.isSubmitting && <Icons.Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
