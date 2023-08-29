import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { siteConfig } from '@/lib/site-config'
import { UserChats } from '@/components/chats/user-chats'

export default async function MainPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const userName = session.user?.name
  const welcomeMsg = 'Welcome'

  return (
    <>
      <h3 className="text-lg font-semibold">
        {userName
          ? `${welcomeMsg}, ${userName.split(' ')[0]}`
          : `${welcomeMsg} to ${siteConfig.name}`}
      </h3>
      <p className="text-sm text-muted-foreground">Start chatting now</p>
      <section className="mt-4">
        <UserChats session={session} />
      </section>
    </>
  )
}
