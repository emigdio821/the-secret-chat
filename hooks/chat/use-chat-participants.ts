import { useQuery } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { ACTIVE_PARTICIPANTS_QUERY } from '@/lib/constants'

export function useChatParticipants(chat: Conversation) {
  async function getParticipants() {
    try {
      const participants = await chat.getParticipants()
      return participants
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[get_participants]', errMessage)
      throw err
    }
  }

  return useQuery({
    queryFn: getParticipants,
    queryKey: [ACTIVE_PARTICIPANTS_QUERY],
  })
}
