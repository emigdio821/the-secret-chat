import { Client, Conversation, Message } from '@twilio/conversations'
import { createContext, useReducer, useContext, useMemo } from 'react'
import { InitialState as StateType, ActionPayload } from 'types'
import { reducer, initialState } from './globalReducer'

interface Provider {
  children: React.ReactNode
}

interface CtxInterface {
  error: string
  client: Client
  isLoading: boolean
  messages: Message[]
  conversation: Conversation
  dispatch: React.Dispatch<ActionPayload>
}

const GlobalContext = createContext<CtxInterface>(null as any)
const useGlobalContext = () => useContext(GlobalContext)

function GlobalProvider({ children }: Provider) {
  const [state, dispatch] = useReducer<React.Reducer<StateType, ActionPayload>>(
    reducer,
    initialState,
  )
  const { client, conversation, error, isLoading, messages } = state
  const providerValue = useMemo(
    () => ({ client, conversation, error, dispatch, isLoading, messages }),
    [client, conversation, error, isLoading, messages],
  )

  return (
    <GlobalContext.Provider value={providerValue as CtxInterface}>
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }
