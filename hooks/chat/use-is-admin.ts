import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IS_ADMIN_QUERY } from '@/lib/constants'

export function useIsChatAdmin(chatId: string, identity: string) {
  async function fetchIsAdmin() {
    if (!identity) return

    try {
      const { data } = await axios.post<{ isAdmin: boolean }>('/api/twilio/is-admin', {
        chatId,
        identity,
      })

      return data.isAdmin
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[fetch_is_admin]', errMessage)
      throw err
    }
  }

  return useQuery({
    enabled: !!identity,
    queryFn: fetchIsAdmin,
    gcTime: 15 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    queryKey: [IS_ADMIN_QUERY, chatId, identity],
  })
}
