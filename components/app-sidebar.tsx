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
  SidebarMenuSkeleton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavChats } from './navs/chats/nav-chats'
import { NavActions } from './navs/nav-actions'
import { NavUser } from './navs/nav-user'
import { Input } from './ui/input'

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
                  <span className="truncate text-xs font-normal">A simple chat</span>
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
            <SidebarMenuSkeleton className="w-20" />
            <div className="flex flex-col gap-1">
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </div>
          </div>
        ) : (
          client && <NavChats />
        )}
      </SidebarContent>
      <SidebarFooter>
        {clientLoading ? (
          <>
            <SidebarMenuSkeleton className="w-30" showIcon />
            <SidebarMenuSkeleton className="w-36" showIcon />
            <SidebarMenuSkeleton className="w-3/4" showIcon />
          </>
        ) : (
          client && (
            <>
              <NavActions />
              <NavUser />
            </>
          )
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
