import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant'
import { ACTIVE_CHAT_ADMINS_QUERY } from '@/lib/constants'

export function useChatAdmins(chatId: string) {
  async function fetchChatAdmins() {
    const { data: admins } = await axios.post<ParticipantInstance[]>('/api/twilio/chat-admins', { chatId })

    return admins
  }

  return useQuery({
    gcTime: 15 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    queryFn: fetchChatAdmins,
    queryKey: [ACTIVE_CHAT_ADMINS_QUERY, chatId],
  })
}
