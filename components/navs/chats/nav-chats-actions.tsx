import type { Conversation } from '@twilio/conversations'
import { Edit2Icon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/ui/sidebar'
import { DeleteChatAlert } from '@/components/dialogs/chat/delete-chat-alert'
import { EditChatDialog } from '@/components/dialogs/chat/edit-chat-dialog'

interface NavFolderActionsProps {
  chat: Conversation
}

export function NavChatsActions({ chat }: NavFolderActionsProps) {
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
        <EditChatDialog
          chat={chat}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit2Icon className="size-4" />
              Edit
            </DropdownMenuItem>
          }
        />

        <DeleteChatAlert
          chat={chat}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} variant="destructive">
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
