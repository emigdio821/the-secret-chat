'use client'

import type { UserAttributes } from '@/types'
import { AtSignIcon, QuoteIcon, UserIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { useUserProfile } from '@/hooks/use-user-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientError } from '@/components/client-error'
import { ProfileSekelton } from '@/components/skeletons'
import { EditProfileDialog } from '../dialogs/profile/edit-profile-dialog'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

export function ProfileSettingsCard() {
  const { data: session } = useSession()
  const user = session?.user
  const { data: profile, isLoading } = useUserProfile()
  const client = useTwilioClientStore((state) => state.client)
  const error = useTwilioClientStore((state) => state.error)
  const loading = useTwilioClientStore((state) => state.loading)

  if (error) {
    return <ClientError />
  }

  const userAttrs = client?.user.attributes as UserAttributes

  return (
    <Card>
      {loading ? (
        <ProfileSekelton />
      ) : (
        client && (
          <>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your profile data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar className="size-16">
                  <AvatarImage
                    alt={client.user.identity}
                    src={(userAttrs?.avatar_url || user?.image) ?? AVATAR_FALLBACK_URL}
                  />
                  <AvatarFallback />
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">
                    {userAttrs?.name || user?.name || client?.user.identity}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <AtSignIcon className="text-muted-foreground size-4" />
                    {client.user.identity}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <UserIcon className="text-muted-foreground size-4" />
                    {userAttrs?.nickname || client.user.friendlyName || '"Nickname"'}
                  </span>

                  <span className="flex items-center gap-2 text-sm">
                    <QuoteIcon className="text-muted-foreground size-4" />
                    {userAttrs?.about || '"About me"'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isLoading ? (
                <Skeleton className="h-9 w-[60px]" />
              ) : (
                profile && <EditProfileDialog profile={profile} trigger={<Button variant="outline">Edit</Button>} />
              )}
            </CardFooter>
          </>
        )
      )}
    </Card>
  )
}
