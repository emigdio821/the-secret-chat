import { redirect } from 'next/navigation'
import { AtSign, User } from 'lucide-react'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { useRainbowGradient } from '@/hooks/use-rainbow-gradient'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
        <Avatar className="mb-4 h-28 w-28 rounded-lg">
          <AvatarImage src={user?.image ?? AVATAR_FALLBACK_URL} alt={`${user?.name}`} />
          <AvatarFallback className="h-28 w-28 rounded-sm">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <CardDescription className="mb-4">
          This picture is from your Github account. It will get synced automatically.
        </CardDescription>
        <h3 className="text-xl font-semibold">{user?.name}</h3>
        <div>
          <h5 className="flex items-center gap-1 text-sm font-medium">
            <AtSign className="h-4 w-4" />
            {user?.email}
          </h5>
        </div>
      </CardContent>
    </Card>
  )
}
