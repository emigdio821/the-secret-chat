import type { Conversation } from '@twilio/conversations'
import { toast } from 'sonner'
import { ACTIVE_PARTICIPANTS_QUERY, USER_CHATS_QUERY } from '@/lib/constants'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { AlertActionDialog } from '../alert-action'

interface DeleteChatAlertProps {
  chat: Conversation
  trigger: React.ReactNode
}

export function DeleteChatAlert({ chat, trigger }: DeleteChatAlertProps) {
  const { invalidateQueries } = useInvalidateQueries()

  async function handleDeleteChat() {
    try {
      await chat.delete()
      await invalidateQueries([USER_CHATS_QUERY, ACTIVE_PARTICIPANTS_QUERY])
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[delete_chat_alert]', errMsg)

      toast.error('Uh oh!', {
        description: 'Unable to delete the chat at this time, try again',
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
