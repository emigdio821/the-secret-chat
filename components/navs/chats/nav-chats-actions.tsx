import type { Conversation } from '@twilio/conversations'
import { Edit2Icon, InfoIcon, LogOutIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useIsChatAdmin } from '@/hooks/chat/use-is-admin'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/ui/sidebar'
import { ChatDetailsDialog } from '@/components/dialogs/chat/chat-details-dialog'
import { DeleteChatAlert } from '@/components/dialogs/chat/delete-chat-alert'
import { EditChatDialog } from '@/components/dialogs/chat/edit-chat-dialog'
import { LeaveChatAlert } from '@/components/dialogs/chat/leave-chat-alert'

interface NavFolderActionsProps {
  chat: Conversation
}

export function NavChatsActions({ chat }: NavFolderActionsProps) {
  const { data: session } = useSession()
  const { data: isAdmin } = useIsChatAdmin(chat.sid, session?.user?.email || '')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <MoreHorizontalIcon />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 break-words">
          {chat.friendlyName || chat.uniqueName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ChatDetailsDialog
          chat={chat}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <InfoIcon className="size-4" />
              Details
            </DropdownMenuItem>
          }
        />

        {!isAdmin && (
          <LeaveChatAlert
            chat={chat}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LogOutIcon className="size-4" />
                Leave
              </DropdownMenuItem>
            }
          />
        )}

        {isAdmin && (
          <>
            <EditChatDialog
              chat={chat}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit2Icon className="size-4" />
                  Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuSeparator />
            <DeleteChatAlert
              chat={chat}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} variant="destructive">
                  <Trash2Icon className="size-4" />
                  Delete
                </DropdownMenuItem>
              }
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
