import { useQuery } from '@tanstack/react-query'
import type { Message } from '@twilio/conversations'
import { MSG_PARTICIPANT_QUERY } from '@/lib/constants'

export function useMessageParticipant(message: Message) {
  async function getMessageParticipant() {
    try {
      return await message.getParticipant()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[get_part_msg]', errMessage)
      throw err
    }
  }

  return useQuery({
    queryFn: getMessageParticipant,
    queryKey: [MSG_PARTICIPANT_QUERY, message.sid],
  })
}
