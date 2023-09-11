import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { type UserAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDisclosure } from '@mantine/hooks'
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
import { GifPicker } from '@/components/gif-picker'
import { Loader } from '@/components/icons'

interface EditProfilePopoverProps {
  client: Client
  session: Session
}

export function EditProfilePopover({ client, session }: EditProfilePopoverProps) {
  const [opened, handlers] = useDisclosure()
  const router = useRouter()
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const userAttrs = client.user.attributes as UserAttributes
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: (userAttrs?.name || session.user?.name) ?? '',
      nickname: (userAttrs?.nickname || client.user.friendlyName) ?? '',
      avatar_url: (userAttrs?.avatar_url || session.user?.image) ?? '',
    },
  })

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    try {
      if (values.nickname) {
        await client.user.updateFriendlyName(values.nickname)
      }

      const attrsPayload: UserAttributes = {
        isOnline: false,
        name: (values.name || userAttrs?.name || session.user?.name) ?? '',
        nickname: (values.nickname || userAttrs?.nickname || client.user.friendlyName) ?? '',
        avatar_url: (values.avatar_url || session.user?.image) ?? '',
      }

      await client.user.updateAttributes(attrsPayload)
      router.refresh()
      handlers.close()
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
    <Popover
      open={opened}
      onOpenChange={(opened) => {
        if (!form.formState.isSubmitting) {
          handlers.toggle()
        }
        if (!opened) {
          form.reset()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          closeBtnRef.current?.focus()
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <span className="flex items-center gap-2">
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
              <GifPicker
                trigger={<Button variant="outline">GIF</Button>}
                callback={(url) => {
                  form.setValue('avatar_url', url)
                }}
              />
            </span>
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
                ref={closeBtnRef}
                variant="outline"
                onClick={() => {
                  handlers.close()
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
