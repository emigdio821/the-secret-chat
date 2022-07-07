import { Client, Conversation } from '@twilio/conversations'
import actions from './globalActions'

const initialState = {
  error: '',
  client: null,
  isLoading: false,
  conversation: undefined,
}

interface State {
  error: string
  client: Client
  isLoading: boolean
  conversation: Conversation
}

interface Action {
  type: string
  payload: string
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case actions.addError:
      return {
        ...state,
        error: action.payload,
      }
    case actions.removeError:
      return {
        ...state,
        error: '',
      }
    case actions.addClient:
      return {
        ...state,
        client: action.payload,
      }
    case actions.addConversation:
      return {
        ...state,
        conversation: action.payload,
      }
    case actions.removeConversation:
      return {
        ...state,
        conversation: undefined,
      }
    default:
      return state
  }
}

export { initialState, reducer }
