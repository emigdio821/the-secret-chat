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

const GlobalContext = createContext<CtxInterface>(null as any)
const useGlobalContext = () => useContext(GlobalContext)

function GlobalProvider({ children }: Provider) {
  const [state, dispatch] = useReducer<React.Reducer<any, any>>(
    reducer,
    initialState,
  )
  const { client, conversation, error } = state
  const providerValue = useMemo(
    () => ({ client, conversation, error, dispatch }),
    [client, conversation, error],
  )

  return (
    <GlobalContext.Provider value={providerValue as CtxInterface}>
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }
