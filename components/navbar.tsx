import NextLink from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ProfileMenu } from '@/components/profile/profile-menu'

export function Navbar() {
  return (
    <header className="bg-background/90 dark:bg-background/90 sticky top-0 z-40 w-full border-b px-4 backdrop-blur-md print:hidden">
      <nav className="mx-auto flex h-12 max-w-2xl items-center justify-between sm:h-14">
        <NextLink
          href="/"
          className={cn(
            buttonVariants({
              variant: 'unstyled',
            }),
            'h-auto p-0 transition-opacity hover:opacity-80',
          )}
        >
          <h5 className="text-sm font-semibold sm:text-base">{siteConfig.name}</h5>
        </NextLink>
        <ProfileMenu />
      </nav>
    </header>
  )
}
