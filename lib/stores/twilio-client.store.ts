import { Client } from '@twilio/conversations'
import axios from 'axios'
import { create } from 'zustand'

interface TwilioClientStore {
  client: Client | null
  initialized: boolean
  loading: boolean
  error: string | null
  initClient: () => Promise<void>
  refreshToken: () => Promise<void>
}

export const useTwilioClientStore = create<TwilioClientStore>((set, get) => ({
  client: null,
  initialized: false,
  loading: true,
  error: null,

  initClient: async () => {
    if (get().initialized) return

    set({ loading: true, error: null })

    try {
      const { data } = await axios.get('/api/twilio/token')
      const twilioClient = new Client(data.access_token)

      twilioClient.on('tokenAboutToExpire', async () => {
        await get().refreshToken()
      })

      twilioClient.on('tokenExpired', async () => {
        await get().refreshToken()
      })

      set({
        client: twilioClient,
        initialized: true,
        loading: false,
        error: null,
      })
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[initClient]', err)
      set({
        error: errMsg,
        loading: false,
      })
    }
  },

  refreshToken: async () => {
    try {
      const { data } = await axios.get('/api/twilio/token')
      const client = get().client

      if (client) {
        await client.updateToken(data.access_token)
      }
    } catch (err) {
      console.error('[refreshToken]', err)
    }
  },
}))
