import {
  Client,
  Message,
  Participant,
  Conversation,
} from '@twilio/conversations'

export interface Session {
  user: {
    name: string
    email: string
    image: string
  }
}

export interface ModalCallbackProps {
  inputVal: string
  closeModal: () => void
  additionalInputVal?: string
  // setInputVal: (val: string) => void
}

export interface InitialState {
  error: string
  isLoading: boolean
  messages: Message[]
  client: Client | undefined
  usersTyping: Participant[]
  conversation: Conversation | undefined
  addError: (payload: string) => void
  removeError: () => void
  addLoading: () => void
  removeLoading: () => void
  addClient: (payload: Client) => void
  removeClient: () => void
}

export interface ActionPayload {
  type: string
  payload?:
    | string
    | Client
    | Conversation
    | undefined
    | boolean
    | Message[]
    | Message
    | Participant
    | Participant[]
}
