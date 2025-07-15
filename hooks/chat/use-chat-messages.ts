import { useQuery } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { ACTIVE_CHAT_MESSAGES_QUERY } from '@/lib/constants'

export function useChatMessages(chat: Conversation) {
  async function getMessages() {
    try {
      const paginator = await chat.getMessages()
      const items = paginator.items

      if (items.length > 0) {
        await chat.updateLastReadMessageIndex(items[items.length - 1].index)
      }

      // setCurrentPaginator(paginator)

      return paginator
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_MESSAGES]', errMessage)
      throw err
    }
  }

  return useQuery({
    queryKey: [ACTIVE_CHAT_MESSAGES_QUERY],
    queryFn: getMessages,
    staleTime: Infinity,
  })
}
