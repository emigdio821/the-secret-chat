import { useCallback, useEffect, useState } from 'react'
import { type Client } from '@twilio/conversations'

import { initClient } from '@/lib/client'
import { useStore } from '@/lib/store'
import { useToast } from '@/components/ui/use-toast'

export function useTwilioClient() {
  const addClient = useStore((state) => state.addClient)
  const clientFromStore = useStore((state) => state.client)
  const [error, setError] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [client, setClient] = useState<Client>()
  const { toast } = useToast()

  const createClient = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const twilioClient = await initClient()
      setClient(twilioClient)
    } catch (err) {
      console.log('[INIT_CLIENT]', err)
      setError('Failed to create client, try again')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!client || client.connectionState === 'error') {
      void createClient()
    }

    if (client && !clientFromStore) {
      client.on('connectionStateChanged', (state) => {
        if (state === 'connecting') {
          toast({
            title: 'Status',
            description: 'Connecting to Twilio…',
          })
        }
        if (state === 'connected') {
          toast({
            title: 'Cool!',
            description: "You're now connected",
          })

          addClient(client)
          setLoading(false)
        }
        // if (state === 'disconnecting') {
        //   toast({
        //     title: 'Status',
        //     description: 'Disconnecting from Twilio…',
        //   })
        // }
        // if (state === 'disconnected') {
        //   toast({
        //     title: 'Status',
        //     description: "You're now disconnected",
        //   })
        // }
        if (state === 'denied') {
          toast({
            title: 'Uh oh!',
            description: 'Failed to connect to Twilio',
          })
          setLoading(false)
          setError('Access denied')
        }
      })
    }

    if (clientFromStore) {
      setLoading(false)
    }

    // return () => {
    //   client?.removeAllListeners()
    // }
  }, [addClient, client, createClient, toast, clientFromStore])

  return { createClient, error, client, isLoading }
}
