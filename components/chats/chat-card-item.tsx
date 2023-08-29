import { useState } from 'react'
import NextLink from 'next/link'
import { type Conversation } from '@twilio/conversations'
import { ArrowRight, Loader2, MoreVertical, Shield, Trash2, User } from 'lucide-react'
import { type Session } from 'next-auth'
import { useQueryClient } from 'react-query'

import { CHATS_QUERY } from '@/lib/constants'
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
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'

interface ChatCardItemProps {
  chat: Conversation
  session: Session
}

interface ConvoDescription {
  description?: string
}

export function ChatCardItem({ chat, session }: ChatCardItemProps) {
  const { createdBy } = chat
  const attrs = chat.attributes as unknown as ConvoDescription
  const partsCount = chat._participants.size
  const isOwner = session.user?.email === createdBy
  const queryClient = useQueryClient()
  const [openedAlert, setOpenedAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)

  async function handleDeleteChat() {
    try {
      setLoading(true)
      await chat.delete()
      await queryClient.refetchQueries({ queryKey: [CHATS_QUERY] })
      setOpenedAlert(false)
      setLoading(false)
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[CHAT_CARDITEM_DELETE]', errMsg)

      toast({
        title: 'Uh oh!',
        description: 'Something went wrong while deleting the chat room, try again',
      })
    }
  }

  return (
    <Card key={chat.sid} className="flex flex-col">
      <CardHeader>
        <span className="flex items-center justify-between">
          <CardTitle className="text-base">{chat.friendlyName}</CardTitle>
          {isOwner && (
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
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </span>
        {attrs.description && <CardDescription>{attrs.description}</CardDescription>}
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {partsCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            {createdBy}
          </span>
        </div>
        <NextLink href={`/chats/${chat.sid}`} className={buttonVariants({ variant: 'outline' })}>
          Join
          <ArrowRight className="ml-2 h-4 w-4" />
        </NextLink>
      </CardFooter>
    </Card>
  )
}
