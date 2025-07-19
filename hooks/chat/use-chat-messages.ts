import { useInfiniteQuery } from '@tanstack/react-query'
import type { Conversation, Message, Paginator } from '@twilio/conversations'
import { ACTIVE_CHAT_MESSAGES_QUERY } from '@/lib/constants'

export function useChatMessages(chat: Conversation) {
  async function getMessages({ pageParam }: { pageParam?: Paginator<Message> | null }) {
    let paginator: Paginator<Message>

    try {
      if (!pageParam) {
        paginator = await chat.getMessages()
      } else {
        paginator = await pageParam.prevPage()
      }

      const items = paginator.items

      if (items.length > 0 && !pageParam) {
        await chat.updateLastReadMessageIndex(items[items.length - 1].index)
      }

      return paginator
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[use_chat_messages]', errMsg)
      throw err
    }
  }

  return useInfiniteQuery({
    queryKey: [ACTIVE_CHAT_MESSAGES_QUERY, chat.sid],
    queryFn: getMessages,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasPrevPage ? lastPage : undefined
    },
  })
}
