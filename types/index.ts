import { Client, Conversation, Message } from '@twilio/conversations'

export interface Session {
  user: {
    name: string
    email: string
    image: string
  }
}

export interface ModalCallbackProps {
  inputVal: string
  onClose: () => void
  setInputVal: (val: string) => void
}

export interface InitialState {
  error: string
  isLoading: boolean
  client: Client | undefined
  messages: Message[]
  conversation: Conversation | undefined
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
}
