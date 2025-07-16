import type { JSONValue } from '@twilio/conversations'

export type UserAttributes = {
  nickname: string
  avatar_url: string
  name: string
} & JSONValue

export type ParticipantAttributes = {
  role?: string
} & UserAttributes

export type MessageAttributes = {
  gif?: boolean
  isEdited?: boolean
} & JSONValue

export type ChatAttributes = {
  description?: string
  chatLogoUrl?: string
} & JSONValue
