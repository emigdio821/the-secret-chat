import type { Client as TwilioClient } from '@twilio/conversations'
import { create } from 'zustand'

type TwilioClientStore = {
  client: TwilioClient | null
  loading: boolean
  error: string | null
  setClient: (client: TwilioClient) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTwilioClientStore = create<TwilioClientStore>((set) => ({
  client: null,
  loading: true,
  error: null,
  setClient: (client) => set({ client, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}))
