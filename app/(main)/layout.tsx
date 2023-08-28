import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <Navbar session={session} />
      <section className="px-4">
        <div className="mx-auto max-w-2xl py-4">{children}</div>
      </section>
    </>
  )
}
