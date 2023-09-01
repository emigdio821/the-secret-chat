import { useState } from 'react'
import { type Message } from '@twilio/conversations'
import { Edit2, MoreVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ControlledAlertDialog } from '@/components/controlled-alert-dialog'

export function MessageActions({ message }: { message: Message }) {
  const [openedAlert, setOpenedAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)

  async function handleDeleteMessage() {
    try {
      setLoading(true)
      await message.remove()
      setOpenedAlert(false)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[DELETE_CHAT_MSG]', errMessage)
    } finally {
      setLoading(false)
    }
  }

  async function handleEditMessage() {
    try {
      await message.updateBody('')
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[EDIT_CHAT_MSG]', errMessage)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <span className="sr-only">Chat menu</span>
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuItem onSelect={handleEditMessage}>
          <Edit2 className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ControlledAlertDialog
          open={openedAlert}
          isLoading={isLoading}
          setOpen={setOpenedAlert}
          action={handleDeleteMessage}
          trigger={
            <DropdownMenuItem
              className="!text-destructive"
              onSelect={(e) => {
                e.preventDefault()
                setOpenedAlert(true)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          }
          alertMessage="This action cannot be undone. This will permanently delete this message."
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
