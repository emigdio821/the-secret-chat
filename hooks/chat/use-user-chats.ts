import { useQuery } from '@tanstack/react-query'
import type { Conversation, Paginator } from '@twilio/conversations'
import { USER_CHATS_QUERY } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'

export function useUserChats(search: string) {
  const client = useTwilioClientStore((state) => state.client)

  function filterBySearch(paginator: Paginator<Conversation> | undefined) {
    if (!search) return paginator

    const items = paginator?.items || []
    const filtered = items?.filter((chat) => chat.friendlyName?.toLowerCase().includes(search.toLocaleLowerCase()))

    return { ...paginator, items: filtered }
  }

  async function getChats() {
    try {
      const chats = await client?.getSubscribedConversations()
      return chats
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[use_user_chats_error]', errMessage)
      throw err
    }
  }

  return useQuery({
    queryKey: [USER_CHATS_QUERY],
    queryFn: getChats,
    select: filterBySearch,
  })
}
