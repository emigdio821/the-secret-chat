import { redirect } from 'next/navigation'
import { GhostIcon } from 'lucide-react'
import { auth } from '@/lib/auth'

export default async function MainPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <section className="flex h-full items-center justify-center">
      <GhostIcon className="text-muted-foreground size-12" />
    </section>
  )
}
