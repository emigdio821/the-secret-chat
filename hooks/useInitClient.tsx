import useStore from 'store/global'
import { initClient } from 'lib/client'
import { useCallback, useState } from 'react'

export default function useInitClient() {
  const { addClient } = useStore()
  const [error, setError] = useState<string>()
  const newClient = useCallback(async () => {
    try {
      const twilioClient = await initClient()
      addClient(twilioClient)
      if (error) {
        setError('')
      }
    } catch {
      setError('Failed to create client, try again')
    }
  }, [addClient, error])

  return { newClient, error, setError }
}
