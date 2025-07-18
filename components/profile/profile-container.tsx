'use client'

import type { UserAttributes } from '@/types'
import { AtSign, User } from 'lucide-react'
import type { Session } from 'next-auth'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { useRainbowGradient } from '@/hooks/use-rainbow-gradient'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientError } from '@/components/client-error'
import { ProfileSekelton } from '@/components/skeletons'
import { EditProfilePopover } from './edit-profile-popover'

export function ProfileContainer({ session }: { session: Session }) {
  const bg = useRainbowGradient()
  const client = useTwilioClientStore((state) => state.client)
  const error = useTwilioClientStore((state) => state.error)
  const loading = useTwilioClientStore((state) => state.loading)

  if (error) {
    return <ClientError />
  }

  const userAttrs = client?.user.attributes as UserAttributes

  return (
    <Card style={{ background: bg }}>
      {loading ? (
        <ProfileSekelton />
      ) : (
        client && (
          <>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Avatar className="h-28 w-28 rounded-lg">
                <AvatarImage
                  className="object-cover"
                  alt={client.user.identity}
                  src={(userAttrs?.avatar_url || session?.user?.image) ?? AVATAR_FALLBACK_URL}
                />
                <AvatarFallback className="h-28 w-28 rounded-lg">
                  <User className="size-6" />
                </AvatarFallback>
              </Avatar>
              <CardDescription className="my-4">Here you&apos;ll find basic info. about your account.</CardDescription>
              <h3 className="text-xl font-semibold">
                {(userAttrs?.name || session?.user?.name) ?? client?.user.identity}
              </h3>
              <div className="mb-4">
                <p className="flex items-center gap-1 text-sm font-medium">
                  <AtSign className="size-4" />
                  {client.user.identity}
                </p>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <User className="size-4" />
                  {(userAttrs?.nickname || client.user.friendlyName) ?? 'Nickname not yet set'}
                </p>
              </div>
              {session?.user && <EditProfilePopover client={client} user={session?.user} />}
            </CardContent>
          </>
        )
      )}
    </Card>
  )
}
