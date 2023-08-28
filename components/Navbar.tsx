import NextLink from 'next/link'
import { Ghost } from 'lucide-react'
import { type Session } from 'next-auth'

import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ProfileMenu } from '@/components/profile/ProfileMenu'

export function Navbar({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 px-4 backdrop-blur-md dark:bg-background/90 print:hidden">
      <nav className="mx-auto flex h-12 max-w-2xl items-center justify-between">
        <NextLink
          href="/"
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'px-0 text-lg font-bold transition-opacity duration-200 hover:no-underline hover:opacity-80',
          )}
        >
          <Ghost className="mr-2 h-4 w-4" />
          {siteConfig.name}
        </NextLink>
        <ProfileMenu session={session} />
      </nav>
    </header>
  )
}
