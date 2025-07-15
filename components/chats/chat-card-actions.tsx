import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { LogOut, MoreVertical, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { USER_CHATS_QUERY } from '@/lib/constants'
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

export function ChatCardActions({ chat }: { chat: Conversation }) {
  const { data: session } = useSession()
  const [openedAlert, setOpenedAlert] = useState(false)
  const [openedLeaveChatAlert, setOpenedLeaveChatAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const isAdmin = session?.user?.email === chat.createdBy
  const queryClient = useQueryClient()

  async function handleDeleteChat() {
    try {
      setLoading(true)
      await chat.delete()
      setOpenedAlert(false)
      setLoading(false)
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[CHAT_CARDITEM_DELETE]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while deleting the chat room, try again',
      })
    }
  }

  async function handleLeaveChat() {
    try {
      setLoading(true)
      await chat.leave()
      setOpenedLeaveChatAlert(false)
      setLoading(false)
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[CHAT_CARDITEM_LEAVE]', errMsg)

      toast.error('Uh oh!', {
        description: 'Something went wrong while leaving the chat room, try again',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <span className="sr-only">Chat menu</span>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuLabel>{chat.friendlyName ?? chat.uniqueName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isAdmin && (
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
                <LogOut className="mr-2 size-4" />
                <span>Leave chat</span>
              </DropdownMenuItem>
            }
            alertMessage={
              <>
                You are about to leave <span className="font-semibold">{`"${chat.uniqueName}"`}</span> chat room.
              </>
            }
          />
        )}
        <ControlledAlertDialog
          open={openedAlert}
          isLoading={isLoading}
          setOpen={setOpenedAlert}
          action={handleDeleteChat}
          trigger={
            <DropdownMenuItem
              className="text-destructive!"
              onSelect={(e) => {
                e.preventDefault()
                setOpenedAlert(true)
              }}
            >
              <Trash2 className="size-4" />
              <span>Delete chat</span>
            </DropdownMenuItem>
          }
          alertMessage={
            <>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-semibold">{`"${chat.uniqueName}"`}</span> chat room and kick all the participants.
            </>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
