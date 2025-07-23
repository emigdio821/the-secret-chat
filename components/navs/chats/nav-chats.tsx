'use client'

import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { throttle } from 'lodash'
import { RotateCwIcon } from 'lucide-react'
import { UNREAD_CHAT_MSGS_QUERY } from '@/lib/constants'
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
  const queryClient = useQueryClient()
  const [isRefetching, setRefetching] = useState(false)
  const searchValue = useSearchChatsInputStore((state) => state.search)
  const { data: chats, error, isLoading, refetch } = useUserChats(searchValue)

  const handleRefetchChats = useCallback(async () => {
    setRefetching(true)
    await refetch()
    await queryClient.invalidateQueries({ queryKey: [UNREAD_CHAT_MSGS_QUERY], exact: false })
    setRefetching(false)
  }, [refetch, queryClient])

  const throttledRefetchChats = useMemo(() => throttle(handleRefetchChats, 5000), [handleRefetchChats])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      {isLoading ? (
        <Skeleton className="absolute top-3.5 right-3 size-4" />
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarGroupAction
              disabled={isRefetching}
              aria-label="Refetch chats"
              onClick={throttledRefetchChats}
              className="text-muted-foreground"
            >
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
