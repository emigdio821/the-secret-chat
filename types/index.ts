import type { Client, JSONValue, Participant } from '@twilio/conversations'

interface RemoveUserTyping {
  participant?: Participant
  removeAll?: boolean
}

export interface InitialState {
  client: Client | undefined
  usersTyping: Participant[]
  addClient: (client: Client) => void
  removeClient: () => void
  addUsersTyping: (participant: Participant) => void
  removeUsersTyping: ({ participant, removeAll }: RemoveUserTyping) => void
}

export type UserAttributes = {
  nickname: string
  avatar_url: string
  name: string
  isOnline: boolean
} & JSONValue

export type ParticipantAttributes = {
  role?: string
} & UserAttributes

export type MessageAttributes = {
  gif?: boolean
  isEdited?: boolean
} & JSONValue

export interface ChatAttributes {
  description?: string
}
