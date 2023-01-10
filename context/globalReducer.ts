import { Message, Participant } from '@twilio/conversations'
import { InitialState as StateType, ActionPayload } from 'types'
import actions from './globalActions'

// to be replaced with zustand :b
const initialState: any = {
  error: '',
  messages: [],
  usersTyping: [],
  isLoading: false,
  conversation: undefined,
}

const reducer = (state: StateType, action: ActionPayload): StateType => {
  switch (action.type) {
    case actions.addMessage: {
      const msg = action.payload as Message
      if (state.messages.some((m) => m.sid === msg.sid)) {
        return state
      }
      return {
        ...state,
        messages: [...state.messages, action.payload] as Message[],
      }
    }
    case actions.removeMessage: {
      const msg = action.payload as Message
      return {
        ...state,
        messages: state.messages.filter((m) => m.sid !== msg.sid),
      }
    }
    case actions.addMessages:
      return {
        ...state,
        messages: action.payload as Message[],
      }
    case actions.removeError:
      return {
        ...state,
        error: '',
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
