'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { debounce } from 'lodash'
import { GhostIcon } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useSearchChatsInputStore } from '@/lib/stores/search-chats-input.store'
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
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavChats } from './navs/chats/nav-chats'
import { NavUser } from './navs/nav-user'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const twilioClient = useTwilioClientStore((state) => state.client)
  const isClientLoading = useTwilioClientStore((state) => state.loading)
  const searchValue = useSearchChatsInputStore((state) => state.search)
  const setSearchValue = useSearchChatsInputStore((state) => state.setSearch)
  const [search, setSearch] = useState(searchValue)

  useEffect(() => {
    if (!twilioClient) {
      initTwilioClient()
    }
  }, [twilioClient])

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchValue(value)
    }, 300),
    [],
  )

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
            <Input
              type="search"
              className="h-8"
              value={search}
              name="search-chats"
              placeholder="Search chats"
              onChange={(e) => {
                setSearch(e.currentTarget.value)
                handleSearch(e.currentTarget.value)
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavFolders />
        <NavTags /> */}

        {isClientLoading ? (
          <div className="p-2">
            <div className="flex h-8 items-center">
              <Skeleton className="h-2 w-16" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
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
