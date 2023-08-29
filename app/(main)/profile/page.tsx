import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AtSign } from 'lucide-react'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { avatarFallbackUrl } from '@/lib/constants'
import { useRainbowGradient } from '@/hooks/use-bg-gradient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const bg = useRainbowGradient()
  const user = session.user

  return (
    <Card style={{ background: bg }}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-transparent">
          <Image fill alt={user?.name ?? 'User image'} src={user?.image ?? avatarFallbackUrl} />
        </div>
        <CardDescription className="mb-4">
          This picture is from your Github account. It will get synced automatically.
        </CardDescription>
        <h3 className="text-xl font-semibold">{user?.name}</h3>
        <div>
          <h5 className="flex items-center gap-1 text-sm font-medium">
            <AtSign className="h-4 w-4" />
            {user?.email}
          </h5>
          {/* <h5 className="text-sm font-medium">{user?.email}</h5> */}
        </div>
      </CardContent>
    </Card>
  )
}
