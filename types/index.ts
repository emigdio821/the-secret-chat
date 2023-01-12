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
  addError: (error: string) => void
  removeError: () => void
  addLoading: () => void
  removeLoading: () => void
  addClient: (client: Client) => void
  removeClient: () => void
  addConversation: (convo: Conversation) => void
  removeConversation: () => void
  removeMessages: () => void
  addMessage: (message: Message) => void
  removeMessage: (message: Message) => void
  addMessages: (messages: Message[]) => void
  addUsersTyping: (participant: Participant) => void
  removeUsersTyping: (participant: Participant) => void
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
