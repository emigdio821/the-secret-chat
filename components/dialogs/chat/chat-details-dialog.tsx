'use client'

import { useState } from 'react'
import type { ChatAttributes } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Conversation } from '@twilio/conversations'
import { LogOutIcon, MessageSquareIcon, ShieldIcon, Trash2Icon, UserPlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { editChatSchema } from '@/lib/zod-schemas'
import { useAdminParticipant } from '@/hooks/chat/use-chat-admin-participant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ParticipantDropdown } from '@/components/active-chat/participant-dropdown'
import { ChatParticipants } from '@/components/active-chat/participants'
import { AddParticipantDialog } from './add-participant-dialog'
import { DeleteChatAlert } from './delete-chat-alert'
import { LeaveChatAlert } from './leave-chat-alert'

interface EditProfileDialogProps {
  chat: Conversation
  trigger: React.ReactNode
}

export function ChatDetailsDialog({ chat, trigger }: EditProfileDialogProps) {
  const { data: session } = useSession()
  const [openDialog, setOpenDialog] = useState(false)
  const chatAttrs = chat.attributes as ChatAttributes | undefined
  const { data: adminParticipant, isLoading } = useAdminParticipant(chat)
  const user = session?.user
  const isAdmin = user?.email === chat.createdBy

  const form = useForm<z.infer<typeof editChatSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(editChatSchema),
    defaultValues: {
      friendlyName: chat.friendlyName ?? '',
      chatLogoUrl: chatAttrs?.chatLogoUrl ?? '',
      description: chatAttrs?.description ?? '',
    },
  })

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-0">
          <DialogTitle>{chat.friendlyName || chat.uniqueName}</DialogTitle>
          <DialogDescription
            className={cn({
              'sr-only': !chatAttrs?.description,
            })}
          >
            {chatAttrs?.description ? chatAttrs.description : 'Edit your chat here.'}
          </DialogDescription>
        </DialogHeader>

        <Avatar className="my-2 size-16">
          <AvatarImage src={form.getValues('chatLogoUrl') || chatAttrs?.chatLogoUrl} />
          <AvatarFallback className="bg-highlight">
            <MessageSquareIcon className="size-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldIcon className="text-muted-foreground size-4" />
            <span className="text-sm leading-none font-semibold">Admin</span>
          </div>
          <div>
            {isLoading ? (
              <div className="flex h-9 w-40 items-center justify-center gap-2 px-3 py-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-2 grow" />
              </div>
            ) : (
              adminParticipant && <ParticipantDropdown participant={adminParticipant} chat={chat} />
            )}
          </div>
        </div>

        <ChatParticipants chat={chat} />

        <DialogFooter className="flex-col">
          <div className="flex items-center justify-center gap-2 sm:justify-normal">
            <Tooltip>
              <AddParticipantDialog
                chat={chat}
                trigger={
                  <TooltipTrigger asChild>
                    <Button aria-label="Add participant" variant="outline" size="icon">
                      <UserPlusIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                }
              />
              <TooltipContent>Add participant</TooltipContent>
            </Tooltip>

            <Tooltip>
              <LeaveChatAlert
                chat={chat}
                trigger={
                  <TooltipTrigger asChild>
                    <Button aria-label="Leave chat" variant="outline" size="icon">
                      <LogOutIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                }
              />
              <TooltipContent>Leave chat</TooltipContent>
            </Tooltip>

            {isAdmin && (
              <Tooltip>
                <DeleteChatAlert
                  chat={chat}
                  trigger={
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="Delete chat"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                  }
                />
                <TooltipContent>Delete chat</TooltipContent>
              </Tooltip>
            )}
          </div>

          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
