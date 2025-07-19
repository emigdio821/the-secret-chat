import { useQuery } from '@tanstack/react-query'
import type { Conversation } from '@twilio/conversations'
import { CHAT_CURRENT_ADMIN } from '@/lib/constants'

export function useAdminParticipant(chat: Conversation) {
  async function getAdminParticipant() {
    try {
      const admin = await chat.getParticipantByIdentity(chat.createdBy)
      return admin
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[use_chat_current_admin', errMessage)
      throw err
    }
  }

  return useQuery({
    queryFn: getAdminParticipant,
    queryKey: [CHAT_CURRENT_ADMIN, chat.sid],
  })
}
