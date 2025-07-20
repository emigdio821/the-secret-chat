import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { TypographyH4 } from '@/components/ui/typography'
import { ProfileSettingsCard } from '@/components/settings/profile'

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <TypographyH4>Settings</TypographyH4>
      <ProfileSettingsCard />
    </>
  )
}
