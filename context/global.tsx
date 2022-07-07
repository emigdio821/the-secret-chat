import { Client, Conversation } from '@twilio/conversations'
import { createContext, useReducer, useContext, useMemo } from 'react'
import { reducer, initialState } from './globalReducer'

interface Provider {
  children: React.ReactNode
}

interface CtxInterface {
  client: Client
  isLoading: boolean
  error: string | null
  conversation: Conversation
  dispatch: React.Dispatch<any>
}

const GlobalContext = createContext<CtxInterface>(null as any)
const useGlobalContext = () => useContext(GlobalContext)

function GlobalProvider({ children }: Provider) {
  const [state, dispatch] = useReducer<React.Reducer<any, any>>(
    reducer,
    initialState,
  )
  const { client, conversation, error, isLoading } = state
  const providerValue = useMemo(
    () => ({ client, conversation, error, dispatch, isLoading }),
    [client, conversation, error, isLoading],
  )

  return (
    <GlobalContext.Provider value={providerValue as CtxInterface}>
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }
