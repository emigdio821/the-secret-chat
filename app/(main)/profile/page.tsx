import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ProfileContainer } from '@/components/profile/profile-container'

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <ProfileContainer session={session} />
}
