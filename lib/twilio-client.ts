import { Client } from '@twilio/conversations'
import { toast } from 'sonner'
import { useTwilioClientStore } from './stores/twilio-client.store'

async function getToken() {
  try {
    const res = await fetch('/api/twilio/token')
    const data = await res.json()

    return data.access_token
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : err
    console.error('[get_token]', errMessage)
  }
}

let twilioInstance: Client | null = null

export async function refreshTwilioInstance() {
  const token = await getToken()
  await twilioInstance?.updateToken(token)
}

export async function initTwilioClient() {
  const setError = useTwilioClientStore.getState().setError
  const setClient = useTwilioClientStore.getState().setClient
  const setLoading = useTwilioClientStore.getState().setLoading

  try {
    if (twilioInstance) return twilioInstance

    const token = await getToken()
    twilioInstance = new Client(token)

    twilioInstance.on('tokenAboutToExpire', () => {
      toast('Client status', {
        duration: Infinity,
        description: 'Client token is about to expire',
        action: {
          label: 'Refresh',
          onClick: async () => {
            toast.promise(refreshTwilioInstance, {
              loading: 'Refreshing token...',
              success: 'Token has been refreshed',
              error: 'Something went wrong',
            })
          },
        },
      })
    })

    twilioInstance.on('tokenExpired', async () => {
      await refreshTwilioInstance()
    })

    setClient(twilioInstance)

    return twilioInstance
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unable to create twilio client at this time, try again.'
    setError(errMsg)
  } finally {
    setLoading(false)
  }
}
