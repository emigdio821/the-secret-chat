import useStore from 'store/global'
import { initClient } from 'lib/client'
import { useCallback, useState } from 'react'

export default function useInitClient() {
  const addClient = useStore((state) => state.addClient)
  const addLoading = useStore((state) => state.addLoading)
  const removeLoading = useStore((state) => state.removeLoading)
  const [error, setError] = useState<string>()
  const newClient = useCallback(async () => {
    try {
      addLoading()
      const twilioClient = await initClient()
      addClient(twilioClient)
      if (error) {
        setError('')
      }
    } catch {
      setError('Failed to create client, try again')
    } finally {
      removeLoading()
    }
  }, [addClient, error, addLoading, removeLoading])

  return { newClient, error, setError }
}
