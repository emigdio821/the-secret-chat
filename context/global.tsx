import {
  Client,
  Message,
  Participant,
  Conversation,
} from '@twilio/conversations'
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
  usersTyping: Participant[]
  dispatch: React.Dispatch<ActionPayload>
}

const GlobalContext = createContext<CtxInterface>(null as any)
const useGlobalContext = () => useContext(GlobalContext)

function GlobalProvider({ children }: Provider) {
  const [state, dispatch] = useReducer<React.Reducer<StateType, ActionPayload>>(
    reducer,
    initialState,
  )
  const { client, conversation, error, isLoading, messages, usersTyping } =
    state
  const providerValue = useMemo(
    () => ({
      error,
      client,
      messages,
      dispatch,
      isLoading,
      usersTyping,
      conversation,
    }),
    [client, conversation, error, isLoading, messages, usersTyping],
  )

  return (
    <GlobalContext.Provider value={providerValue as CtxInterface}>
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }
