import { useQueryClient } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { toast } from 'sonner'
import { ACTIVE_PARTICIPANTS_QUERY, USER_CHATS_QUERY } from '@/lib/constants'
import { AlertActionDialog } from '../alert-action'

interface DeleteChatAlertProps {
  chat: Conversation
  trigger: React.ReactNode
}

export function DeleteChatAlert({ chat, trigger }: DeleteChatAlertProps) {
  const queryClient = useQueryClient()

  async function handleDeleteChat() {
    try {
      await chat.delete()
      await queryClient.invalidateQueries({ queryKey: [USER_CHATS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_PARTICIPANTS_QUERY] })
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.error('[delete_chat_alert]', errMsg)

      toast.error('Error', {
        description: 'Unable to delete the chat at this time, try again.',
      })
    }
  }

  return (
    <AlertActionDialog
      destructive
      trigger={trigger}
      title="Delete chat?"
      action={async () => await handleDeleteChat()}
      message="This chat will permanently be deleted and kick all the participants. This action cannot be undone."
    />
  )
}
