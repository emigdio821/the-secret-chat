import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { siteConfig } from '@/lib/site-config'
import { MyChatsContainer } from '@/components/chats/my-chats-container'

export default async function MainPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const userName = session.user?.name
  const welcomeMsg = 'Welcome'

  return (
    <>
      <h3 className="text-lg font-semibold">
        {userName ? `${welcomeMsg}, ${userName.split(' ')[0]}` : `${welcomeMsg} to ${siteConfig.name}`}
      </h3>
      <p className="text-muted-foreground text-sm">Start chatting now</p>
      <section className="mt-4">
        <MyChatsContainer />
      </section>
    </>
  )
}
