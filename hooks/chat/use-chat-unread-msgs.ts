import { useQuery } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { UNREAD_CHAT_MSGS_QUERY } from '@/lib/constants'

export function useChatUnreadMsgs(chat: Conversation) {
  async function getUnreadMessages() {
    try {
      return await chat.getUnreadMessagesCount()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[chat_unread_msgs_query]', errMessage)
      throw err
    }
  }

  return useQuery({
    queryKey: [UNREAD_CHAT_MSGS_QUERY, chat.sid],
    queryFn: getUnreadMessages,
  })
}
