import type { IGif } from '@giphy/js-types'
import type { JSONValue } from '@twilio/conversations'

export type UserAttributes = {
  nickname: string
  avatar_url: string
  name: string
  about: string
} & JSONValue

export type ParticipantAttributes = {
  role?: string
} & UserAttributes

export type MessageAttributes = {
  gif?: boolean
  sticker?: boolean
  isEdited?: boolean
} & JSONValue

export type ChatAttributes = {
  description?: string
  chatLogoUrl?: string
} & JSONValue

export interface GiphyResponse {
  data: IGif[]
  meta: {
    msg: string
    status: number
    response_id: string
  }
  pagination: {
    count: number
    offset: number
    total_count: number
  }
}

export enum GiphyType {
  Gif = 'gif',
  Sticker = 'sticker',
}
