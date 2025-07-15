'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { GhostIcon } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { initTwilioClient } from '@/lib/twilio-client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavChats } from './navs/chats/nav-chats'
import { NavUser } from './navs/nav-user'
import { Input } from './ui/input'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const twilioClient = useTwilioClientStore((state) => state.client)
  const isClientLoading = useTwilioClientStore((state) => state.loading)

  useEffect(() => {
    if (!twilioClient) {
      initTwilioClient()
    }
  }, [twilioClient])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton size="lg" asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <div className="bg-highlight flex size-8 items-center justify-center rounded-lg">
                  <GhostIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{siteConfig.name}</span>
                  <span className="truncate text-xs">A simple chat</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* TODO: Implement this */}
            <Input type="search" name="search-chats" placeholder="Search chats" className="h-8" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavFolders />
        <NavTags /> */}

        {isClientLoading ? (
          <div>
            <SidebarMenuSkeleton className="w-20" />
            <SidebarMenuSkeleton />
          </div>
        ) : (
          <NavChats />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
