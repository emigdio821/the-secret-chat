'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { debounce } from 'lodash'
import { GhostIcon } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useSearchChatsInputStore } from '@/lib/stores/search-chats-input.store'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
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
// import { CreateChatDialog } from './chats/create-chat-dialog'
import { NavChats } from './navs/chats/nav-chats'
import { NavUser } from './navs/nav-user'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const initClient = useTwilioClientStore((state) => state.initClient)
  const client = useTwilioClientStore((state) => state.client)
  const clientLoading = useTwilioClientStore((state) => state.loading)
  const searchStoreValue = useSearchChatsInputStore((state) => state.search)
  const setSearchStoreValue = useSearchChatsInputStore((state) => state.setSearch)
  const [searchInputVal, setSearchInputVal] = useState(searchStoreValue)

  const debouncedSearch = useMemo(() => {
    return debounce((val: string) => {
      setSearchStoreValue(val)
    }, 300)
  }, [setSearchStoreValue])

  useEffect(() => {
    initClient()
  }, [initClient])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  useEffect(() => {
    if (searchStoreValue) {
      setSearchInputVal(searchStoreValue)
    }
  }, [searchStoreValue])

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
              name="search-chats"
              value={searchInputVal}
              placeholder="Search chats"
              onChange={(e) => {
                const value = e.currentTarget.value
                setSearchInputVal(value)
                debouncedSearch(value)
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {clientLoading ? (
          <div className="p-2">
            <div className="flex h-8 items-center">
              <Skeleton className="h-2 w-16" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex h-12 items-center gap-2 p-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-2 w-3/5" />
              </div>
              <div className="flex h-12 items-center gap-2 p-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-2 w-3/5" />
              </div>
              <div className="flex h-12 items-center gap-2 p-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-2 w-3/5" />
              </div>
            </div>
          </div>
        ) : (
          client && <NavChats />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
