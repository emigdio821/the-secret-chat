'use client'

import Link from 'next/link'
import type { UserAttributes } from '@/types'
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { useUserProfile } from '@/hooks/use-user-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Skeleton } from '../ui/skeleton'

export function NavUser() {
  const { setTheme, theme } = useTheme()
  const { data: session, status } = useSession()
  const user = session?.user
  const { data: profile, isLoading } = useUserProfile()
  const userAttrs = profile?.attributes as UserAttributes | undefined
  const avatarUrl = (userAttrs?.avatar_url || user?.image) ?? AVATAR_FALLBACK_URL

  if (status === 'loading' || isLoading)
    return (
      <div className="flex h-8 items-center gap-2 p-2">
        <Skeleton className="size-5" />
        <Skeleton className="h-2 w-3/4" />
      </div>
    )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-5">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="sm:w-(--radix-dropdown-menu-trigger-width)" align="start">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MoonIcon className="text-muted-foreground hidden size-4 dark:block" />
                  <SunIcon className="text-muted-foreground size-4 dark:hidden" />
                  <span className="ml-2">Appearance</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem checked={theme === 'light'} onClick={() => setTheme('light')}>
                      Light
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={() => setTheme('dark')}>
                      Dark
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={() => setTheme('system')}>
                      System
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <SettingsIcon className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ redirectTo: '/login' })}>
                <LogOutIcon className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
