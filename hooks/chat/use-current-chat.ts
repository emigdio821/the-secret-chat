import { useQuery } from '@tanstack/react-query'
import { ACTIVE_CHAT_QUERY } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'

export function useCurrentChat(chatId: string) {
  const client = useTwilioClientStore((state) => state.client)

  async function getCurrentChat() {
    if (!client) throw new Error('Twilio client is undefined')

    try {
      const chat = await client.getConversationBySid(chatId)
      return chat
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[get_current_chat]', errMessage)
      throw err
    }
  }

  return useQuery({
    queryKey: [ACTIVE_CHAT_QUERY, chatId],
    queryFn: getCurrentChat,
    enabled: true,
  })
}
