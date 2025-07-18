import type { Conversation } from '@twilio/conversations'
import { toast } from 'sonner'
import { USER_CHATS_QUERY } from '@/lib/constants'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { AlertActionDialog } from '../alert-action'

interface DeleteChatAlertProps {
  chat: Conversation
  trigger: React.ReactNode
}

export function LeaveChatAlert({ chat, trigger }: DeleteChatAlertProps) {
  const { invalidateQueries } = useInvalidateQueries()

  async function handleLeaveChat() {
    try {
      await chat.leave()
      await invalidateQueries([USER_CHATS_QUERY])
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.error('[leave_chat_alert]', errMsg)

      toast.error('Error', {
        description: 'Unable to leave the chat at this time, try again.',
      })
    }
  }

  return (
    <AlertActionDialog
      trigger={trigger}
      title="Leave chat?"
      action={async () => await handleLeaveChat()}
      message="You are about to leave this chat."
    />
  )
}
