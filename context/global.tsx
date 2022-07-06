import { Client, Conversation } from '@twilio/conversations'
import { createContext, useReducer, useContext, useMemo } from 'react'
import { reducer, initialState } from './globalReducer'

interface Provider {
  children: React.ReactNode
}

interface CtxInterface {
  error: string | null
  client: Client
  dispatch: React.Dispatch<any>
  conversation: Conversation
}

const GlobalContext = createContext<CtxInterface | null>(null)
const useGlobalContext = () => useContext(GlobalContext)

function GlobalProvider({ children }: Provider) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { client, conversation, error } = state
  const providerValue: CtxInterface = useMemo(
    () => ({ client, conversation, error, dispatch }),
    [client, conversation, error],
  )

  return (
    <GlobalContext.Provider value={providerValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }
