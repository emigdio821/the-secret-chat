import type { ChatAttributes } from '@/types'
import type { Client, Conversation } from '@twilio/conversations'
import { Edit2Icon, InfoIcon, LogOut, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteChatAlert } from '../dialogs/chat/delete-chat-alert'
import { EditChatDialog } from '../dialogs/chat/edit-chat-dialog'
import { LeaveChatAlert } from '../dialogs/chat/leave-chat-alert'
import { AddParticipantDialog } from './add-participant-dialog'

interface ChatActionsProps {
  chat: Conversation
  client: Client
}

export default function ChatActions({ chat, client }: ChatActionsProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.email === chat.createdBy
  const chatAttrs = chat.attributes as ChatAttributes | undefined

  return (
    <>
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Chat menu</span>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-[180px]">
            <DropdownMenuLabel className="sm:hidden">{chat.friendlyName ?? 'Chat'}</DropdownMenuLabel>
            {chatAttrs?.description && (
              <DropdownMenuLabel className="pt-0 text-xs font-normal sm:hidden">
                {chatAttrs?.description}
              </DropdownMenuLabel>
            )}
            <DropdownMenuSeparator className="sm:hidden" />
            <AddParticipantDialog chat={chat} client={client} />
            <EditChatDialog
              chat={chat}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit2Icon className="size-4" />
                  Edit
                </DropdownMenuItem>
              }
            />
            {/* TODO: Implement this */}
            <DropdownMenuItem disabled>
              <InfoIcon className="size-4" />
              Details
            </DropdownMenuItem>
            {!isAdmin && (
              <LeaveChatAlert
                chat={chat}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LogOut className="size-4" />
                    <span>Leave</span>
                  </DropdownMenuItem>
                }
              />
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
