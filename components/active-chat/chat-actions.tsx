import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Conversation } from '@twilio/conversations'
import { LogOut, MoreVertical, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { CHATS_QUERY, PARTICIPANTS_QUERY } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ControlledAlertDialog } from '@/components/controlled-alert-dialog'

import { AddParticipantDialog } from './add-participant-dialog'

export default function ChatActions({ chat }: { chat: Conversation }) {
  const queryClient = useQueryClient()
  const [openedAlert, setOpenedAlert] = useState(false)
  const [openedLeaveChatAlert, setOpenedLeaveChatAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { data: session } = useSession()
  const isAdmin = session?.user?.email === chat.createdBy

  async function handleDeleteChat() {
    try {
      setLoading(true)
      await chat.delete()
      await queryClient.refetchQueries({ queryKey: [CHATS_QUERY] })
      await queryClient.refetchQueries({ queryKey: [PARTICIPANTS_QUERY] })
      setOpenedAlert(false)
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[CHAT_ACTIONS_DELETE]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while deleting the chat room, try again',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleLeaveChat() {
    try {
      setLoading(true)
      await chat.leave()
      setOpenedLeaveChatAlert(false)
      setLoading(false)
      await queryClient.refetchQueries({ queryKey: [CHATS_QUERY] })
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[CHAT_ACTIONS_LEAVE]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while leaving the chat room, try again',
      })
    }
  }

  return (
    <>
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <span className="sr-only">Chat menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-[180px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <AddParticipantDialog chat={chat} />
            <ControlledAlertDialog
              open={openedLeaveChatAlert}
              isLoading={isLoading}
              setOpen={setOpenedLeaveChatAlert}
              action={handleLeaveChat}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setOpenedLeaveChatAlert(true)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Leave chat</span>
                </DropdownMenuItem>
              }
              alertMessage={
                <>
                  You are about to leave{' '}
                  <span className="font-semibold">{`"${chat.uniqueName}"`}</span> chat room.
                </>
              }
            />
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <ControlledAlertDialog
                  open={openedAlert}
                  isLoading={isLoading}
                  setOpen={setOpenedAlert}
                  action={handleDeleteChat}
                  trigger={
                    <DropdownMenuItem
                      className="!text-destructive"
                      onSelect={(e) => {
                        e.preventDefault()
                        setOpenedAlert(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete chat</span>
                    </DropdownMenuItem>
                  }
                  alertMessage={
                    <>
                      This action cannot be undone. This will permanently delete{' '}
                      <span className="font-semibold">{`"${chat.uniqueName}"`}</span> chat room.
                    </>
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
