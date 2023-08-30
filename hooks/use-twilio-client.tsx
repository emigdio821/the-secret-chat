import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GET_CLIENT_QUERY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { initClient } from '@/lib/twilio-client'

export function useTwilioClient() {
  const addClient = useStore((state) => state.addClient)
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(true)
  const createClient = useCallback(async () => {
    try {
      return await initClient()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[CREATE_CLIENT]', errMessage)
      setError(errMessage as string)
      setLoading(false)
      return null
    }
  }, [])

  const { data: client, refetch: refetchClient } = useQuery([GET_CLIENT_QUERY], createClient, {
    staleTime: Infinity,
  })

  useEffect(() => {
    if (client) {
      if (client.connectionState === 'connected') {
        setLoading(false)
      } else {
        client.on('connectionStateChanged', (state) => {
          if (state === 'connected') {
            toast('Client status', { description: 'Connected' })
            addClient(client)
            setLoading(false)
            setError('')
          }
          if (state === 'denied' || state === 'error') {
            const errMsg =
              state === 'error'
                ? 'Something went wrong while connecting, try again'
                : 'Access denied'
            toast.error('Client status', {
              description: errMsg,
            })
            setLoading(false)
            setError(errMsg)
          }
        })
      }
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client, addClient])

  return { createClient, error, client, isLoading, refetchClient }
}
