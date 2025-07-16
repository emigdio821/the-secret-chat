import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { USER_CHATS_QUERY } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'

export function useUserChats(search: string) {
  const client = useTwilioClientStore((state) => state.client)
  const [debouncedSearch] = useDebouncedValue(search, 500)

  function filterBySearch(chats: Conversation[] | undefined) {
    const searchText = debouncedSearch.trim()
    if (!searchText || !search) return chats

    return chats?.filter((chat) => chat.uniqueName?.toLowerCase().includes(searchText.toLocaleLowerCase()))
  }

  async function getChats() {
    try {
      const chats = await client?.getSubscribedConversations()
      if (!chats) return []

      // sortArray({ items: chats.items, key: 'friendlyName' })

      return chats.items
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[use_user_chats_error]', errMessage)
      return []
    }
  }

  return useQuery({
    queryKey: [USER_CHATS_QUERY],
    queryFn: getChats,
    select: filterBySearch,
  })
}
