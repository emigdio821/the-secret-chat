import type { UserAttributes } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { ACTIVE_CHAT_QUERY } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'

export function useCurrentChat(chatId: string) {
  const client = useTwilioClientStore((state) => state.client)

  async function getCurrentChat() {
    if (!client) throw new Error('Twilio client is undefined')

    try {
      const chat = await client.getConversationBySid(chatId)
      const user = await client.getUser(client.user.identity)
      const userAttrs = user?.attributes as UserAttributes | undefined

      if (chat?.status === 'notParticipating') {
        // await chat.join()
        await chat.add(client.user.identity, {
          isOnline: true,
          nickname: user.friendlyName,
          avatar_url: userAttrs?.avatar_url || '',
          name: userAttrs?.name || '',
        })
      } else {
        const participant = await chat.getParticipantByIdentity(client.user.identity)
        await participant?.updateAttributes({
          isOnline: true,
          nickname: user.friendlyName,
          avatar_url: userAttrs?.avatar_url || '',
          name: userAttrs?.name || '',
        })
      }

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
  })
}
