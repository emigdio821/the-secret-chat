import type { Conversation } from '@twilio/conversations'
import { Edit2Icon, InfoIcon, LogOutIcon, MoreHorizontalIcon, Trash2Icon, UserPlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AddParticipantDialog } from '../dialogs/chat/add-participant-dialog'
import { ChatDetailsDialog } from '../dialogs/chat/chat-details-dialog'
import { DeleteChatAlert } from '../dialogs/chat/delete-chat-alert'
import { EditChatDialog } from '../dialogs/chat/edit-chat-dialog'
import { LeaveChatAlert } from '../dialogs/chat/leave-chat-alert'

interface ChatActionsProps {
  chat: Conversation
}

export default function ChatActions({ chat }: ChatActionsProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.email === chat.createdBy

  return (
    <>
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <span className="sr-only">Chat menu</span>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-52">
            <ChatDetailsDialog
              chat={chat}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <InfoIcon className="size-4" />
                  Details
                </DropdownMenuItem>
              }
            />

            {isAdmin && (
              <EditChatDialog
                chat={chat}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit2Icon className="size-4" />
                    Edit
                  </DropdownMenuItem>
                }
              />
            )}

            <AddParticipantDialog
              chat={chat}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <UserPlusIcon className="size-4" />
                  Add participant
                </DropdownMenuItem>
              }
            />
            {!isAdmin && (
              <>
                <DropdownMenuSeparator />
                <LeaveChatAlert
                  chat={chat}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <LogOutIcon className="size-4" />
                      Leave
                    </DropdownMenuItem>
                  }
                />
              </>
            )}
            {isAdmin && (
              <>
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
      )}
    </>
  )
}
