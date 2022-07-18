import { useGlobalContext } from 'context/global'
import { initClient } from 'lib/client'
import { useCallback, useState } from 'react'
import actions from 'context/globalActions'

export default function useInitClient() {
  const { dispatch } = useGlobalContext()
  const [error, setError] = useState<string>()
  const newClient = useCallback(async () => {
    try {
      const twilioClient = await initClient()
      dispatch({
        type: actions.addClient,
        payload: twilioClient,
      })
      if (error) {
        setError('')
      }
    } catch {
      setError('Failed to create client, try again')
    }
  }, [dispatch, error])

  return { newClient, error, setError }
}
