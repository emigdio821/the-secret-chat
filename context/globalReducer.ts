import {
  Client,
  Message,
  Participant,
  Conversation,
} from '@twilio/conversations'
import { InitialState as StateType, ActionPayload } from 'types'
import actions from './globalActions'

const initialState = {
  error: '',
  messages: [],
  usersTyping: [],
  isLoading: false,
  client: undefined,
  conversation: undefined,
} as StateType

const reducer = (state: StateType, action: ActionPayload): StateType => {
  switch (action.type) {
    case actions.addError:
      return {
        ...state,
        error: action.payload as string,
      }
    case actions.addMessage: {
      return {
        ...state,
        messages: [...state.messages, action.payload] as Message[],
      }
    }
    case actions.removeMessages: {
      return {
        ...state,
        messages: [],
      }
    }
    case actions.addMessages:
      return {
        ...state,
        messages: action.payload as Message[],
      }

    case actions.setLoading:
      return {
        ...state,
        isLoading: true,
      }
    case actions.removeLoading:
      return {
        ...state,
        isLoading: false,
      }
    case actions.removeError:
      return {
        ...state,
        error: '',
      }
    case actions.addClient:
      return {
        ...state,
        client: action.payload as Client,
      }
    case actions.removeClient:
      return {
        ...state,
        client: undefined,
      }
    case actions.addConversation:
      return {
        ...state,
        conversation: action.payload as Conversation,
      }
    case actions.removeConversation:
      return {
        ...state,
        conversation: undefined,
      }
    case actions.addUsersTyping: {
      const part = action.payload as Participant

      if (state.usersTyping.some((p) => p.sid === part.sid)) {
        return state
      }

      return {
        ...state,
        usersTyping: [...state.usersTyping, part],
      }
    }
    case actions.removeUsersTyping: {
      const part = action.payload as Participant
      return {
        ...state,
        usersTyping: state.usersTyping.filter((p) => p.sid !== part.sid),
      }
    }
    default:
      return state
  }
}

export { initialState, reducer }
