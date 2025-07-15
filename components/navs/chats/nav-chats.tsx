'use client'

import { RotateCwIcon } from 'lucide-react'
import { useSearchChatsInputStore } from '@/lib/stores/search-chats-input.store'
import { useUserChats } from '@/hooks/chat/use-user-chats'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { NavChatsItem } from './nav-chats-item'

export function NavChats() {
  const searchValue = useSearchChatsInputStore((state) => state.search)
  const { data: chats, error, isLoading, refetch } = useUserChats(searchValue)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && (
            <>
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </>
          )}
          {error && (
            <SidebarMenuButton onClick={() => refetch()}>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Refetch folders</span>
              </div>
              <RotateCwIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          )}
          {chats?.map((chat) => (
            <NavChatsItem key={chat.sid} chat={chat} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
