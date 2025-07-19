import { useState } from 'react'
import type { Message } from '@twilio/conversations'
import { Edit2Icon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertActionDialog } from '../dialogs/alert-action'
import { EditMessageDialog } from '../dialogs/chat/edit-message-dialog'

interface MessageActionsProps {
  message: Message
  isEditable: boolean
}

export function MessageActions({ message, isEditable }: MessageActionsProps) {
  const [openActions, setOpenActions] = useState(false)

  async function handleDeleteMessage() {
    try {
      await message.remove()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[delete_chat_msg]', errMessage)
    }
  }

  return (
    <DropdownMenu open={openActions} onOpenChange={setOpenActions}>
      <DropdownMenuTrigger asChild>
        <Button type="button" aria-label="Message actions" variant="ghost" size="icon" className="size-5">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuLabel>Message actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isEditable && (
          <EditMessageDialog
            message={message}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit2Icon className="size-4" />
                Edit
              </DropdownMenuItem>
            }
          />
        )}
        <AlertActionDialog
          destructive
          title="Delete message?"
          action={async () => {
            await handleDeleteMessage()
            setOpenActions(false)
          }}
          trigger={
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
