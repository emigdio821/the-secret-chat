import { useCallback, useEffect, useState } from 'react'

import { initClient } from '@/lib/client'
import { useStore } from '@/lib/store'

export function useTwilioClient() {
  const addClient = useStore((state) => state.addClient)
  const client = useStore((state) => state.client)
  const [error, setError] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const createClient = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const twilioClient = await initClient()
      addClient(twilioClient)
    } catch (err) {
      console.log('[INIT_CLIENT]', err)
      setError('Failed to create client, try again')
    } finally {
      setLoading(false)
    }
  }, [addClient])

  useEffect(() => {
    if (!client) {
      void createClient()
    }
  }, [client, createClient])

  return { createClient, error, client, isLoading }
}
