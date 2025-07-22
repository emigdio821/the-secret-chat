import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { appOgUrl, siteConfig } from '@/config/site'
import { auth } from '@/lib/auth'
import { TypographyH4 } from '@/components/ui/typography'
import { ProfileSettingsCard } from '@/components/settings/profile'

export async function generateMetadata() {
  return {
    title: 'Settings',
    description: `${siteConfig.name} - settings`,
    openGraph: {
      type: 'website',
      title: 'Settings',
      description: `${siteConfig.name} - settings`,
      url: appOgUrl,
      images: [
        {
          url: `/og?title=${encodeURIComponent('Settings')}&description=${encodeURIComponent(`${siteConfig.name} - settings`)}`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Settings',
      description: `${siteConfig.name} - settings`,
      images: [
        {
          url: `/og?title=${encodeURIComponent('Settings')}&description=${encodeURIComponent(`${siteConfig.name} - settings`)}`,
        },
      ],
      creator: '@emigdio821',
    },
  } satisfies Metadata
}

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
