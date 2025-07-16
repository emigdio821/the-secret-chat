import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ChatAttributes } from '@/types'
import type { Conversation } from '@twilio/conversations'
import { MessageSquareIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatUnreadMsgs } from '@/hooks/chat/use-chat-unread-msgs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { NavChatsActions } from './nav-chats-actions'

export function NavChatsItem({ chat }: { chat: Conversation }) {
  const pathname = usePathname()
  const { data: unreadMsgs } = useChatUnreadMsgs(chat)
  const chatAttrs = chat.attributes as ChatAttributes | undefined

  return (
    <SidebarMenuItem key={chat.sid}>
      <SidebarMenuButton
        asChild
        size="lg"
        isActive={pathname === `/chat/${chat.sid}`}
        className={cn(unreadMsgs && 'group-has-data-[sidebar=menu-action]/menu-item:pr-16')}
      >
        <Link href={`/chat/${chat.sid}`}>
          <Avatar className="size-8">
            <AvatarImage src={chatAttrs?.chatLogoUrl} />
            <AvatarFallback className="bg-highlight">
              <MessageSquareIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
          <span>{chat.friendlyName || chat.uniqueName}</span>
        </Link>
      </SidebarMenuButton>
      {!!unreadMsgs && <SidebarMenuBadge className="right-8">{unreadMsgs}</SidebarMenuBadge>}
      <NavChatsActions chat={chat} />
    </SidebarMenuItem>
  )
}
