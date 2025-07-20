'use client'

import { RotateCwIcon } from 'lucide-react'
import { useSearchChatsInputStore } from '@/lib/stores/search-chats-input.store'
import { useUserChats } from '@/hooks/chat/use-user-chats'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { NavChatsItem } from './nav-chats-item'

export function NavChats() {
  const searchValue = useSearchChatsInputStore((state) => state.search)
  const { data: chats, error, isLoading, isRefetching, refetch } = useUserChats(searchValue)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      {isLoading ? (
        <Skeleton className="absolute top-3.5 right-3 size-4" />
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarGroupAction disabled={isRefetching} aria-label="Refetch chats">
              <RotateCwIcon />
            </SidebarGroupAction>
          </TooltipTrigger>
          <TooltipContent>Refetch chats</TooltipContent>
        </Tooltip>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && (
            <>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </>
          )}
          {error && (
            <SidebarMenuButton onClick={() => refetch()}>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Refetch chats</span>
              </div>
              <RotateCwIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          )}
          {chats?.items.map((chat) => (
            <NavChatsItem key={chat.sid} chat={chat} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
