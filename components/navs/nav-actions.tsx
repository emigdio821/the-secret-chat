import { LogInIcon, MessageSquarePlusIcon } from 'lucide-react'
import { CreateChatDialog } from '../dialogs/chat/create-chat-dialog'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

export function NavActions() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          <LogInIcon className="size-4" />
          Join chat
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <CreateChatDialog
          trigger={
            <SidebarMenuButton>
              <MessageSquarePlusIcon className="size-4" />
              Create chat
            </SidebarMenuButton>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
