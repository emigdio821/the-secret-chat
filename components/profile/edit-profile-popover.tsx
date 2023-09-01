import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Client } from '@twilio/conversations'
import { type Session } from 'next-auth'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type * as z from 'zod'

import { editProfileSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Loader } from '@/components/icons'

interface EditProfilePopoverProps {
  client: Client
  session: Session
}

export function EditProfilePopover({ client, session }: EditProfilePopoverProps) {
  const [opened, setOpened] = useState(false)
  const router = useRouter()
  const currentAttrs = client.user.attributes as unknown as UserAttributes
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: (currentAttrs.name || session.user?.name) ?? '',
      nickname: (currentAttrs.nickname || client.user.friendlyName) ?? '',
      avatar_url: currentAttrs.avatar_url,
    },
  })

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    try {
      if (values.nickname) {
        await client.user.updateFriendlyName(values.nickname)
      }

      const attrsPayload = {
        name: (values.name || currentAttrs.name || session.user?.name) ?? '',
        nickname: (values.nickname || currentAttrs.nickname || client.user.friendlyName) ?? '',
        avatar_url: values.avatar_url,
      }

      await client.user.updateAttributes(attrsPayload)
      router.refresh()
      setOpened(false)
      form.reset(attrsPayload)
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[UPODATE_PROFILE]', errMsg)
      toast.error('Uh oh!', {
        description: 'Something went wrong while updating your profile, try again',
      })
    }
  }

  return (
    <Popover open={opened} onOpenChange={setOpened}>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              name="avatar_url"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input autoComplete="false" placeholder="Avatar URL" {...field} />
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
                  <FormControl>
                    <Input autoComplete="false" placeholder="Name" {...field} />
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
                  <FormControl>
                    <Input autoComplete="false" placeholder="Nickname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpened(false)
                }}
              >
                Close
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save
                {form.formState.isSubmitting && <Loader className="ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
