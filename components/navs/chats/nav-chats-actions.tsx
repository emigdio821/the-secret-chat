import type { Conversation } from '@twilio/conversations'
import { MoreHorizontalIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/ui/sidebar'

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
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
        {/* <AlertActionDialog
          destructive
          title="Delete folder?"
          message="It will also delete all bookmarks/folders related to this folder. This action cannot be undone."
          action={async () => await handleDeleteFolder(folder.id)}
          trigger={
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          }
        /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
