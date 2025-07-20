import { useQuery } from '@tanstack/react-query'
import { USER_PROFILE } from '@/lib/constants'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'

export function useUserProfile() {
  const client = useTwilioClientStore((state) => state.client)
  const initialized = useTwilioClientStore((state) => state.initialized)

  async function getUserProfile() {
    return client?.user || null
  }

  return useQuery({
    queryFn: getUserProfile,
    queryKey: [USER_PROFILE],
    enabled: initialized && !!client,
  })
}
