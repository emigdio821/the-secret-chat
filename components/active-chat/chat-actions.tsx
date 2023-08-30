import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Conversation } from '@twilio/conversations'
import { LogOut, MoreVertical, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { CHATS_QUERY, PARTICIPANTS_QUERY } from '@/lib/constants'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Loader } from '@/components/icons'

import { AddParticipantDialog } from './add-participant-dialog'

export default function ChatActions({ chat }: { chat: Conversation }) {
  const queryClient = useQueryClient()
  const [openedAlert, setOpenedAlert] = useState(false)
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
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Leave chat
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <AlertDialog
                  open={openedAlert}
                  onOpenChange={(isOpen) => {
                    if (!isLoading) {
                      setOpenedAlert(isOpen)
                    }
                  }}
                >
                  <AlertDialogTrigger asChild>
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
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{' '}
                        <span className="font-semibold">{`"${chat.uniqueName}"`}</span> chat room.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isLoading}
                        onClick={async (e) => {
                          e.preventDefault()
                          await handleDeleteChat()
                        }}
                      >
                        Continue
                        {isLoading && <Loader className="ml-2" />}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
