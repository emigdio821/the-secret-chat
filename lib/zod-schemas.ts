import * as z from 'zod'

const requiredField = z.string().trim().nonempty('Required field')
const optionalField = z.string().trim()
const envVariable = z.string().nonempty()

export const loginFormSchema = z.object({
  username: requiredField,
  password: requiredField,
})

export const createChatRoomSchema = z.object({
  name: requiredField.max(40, 'The max length is 40 characters'),
  join_after: z.boolean().default(false),
  description: optionalField.max(100, 'The max length is 100 characters'),
})

export const joinChatRoomSchema = z.object({
  name: requiredField,
})

export const addParticipantSchema = z.object({
  id: requiredField,
})

export const sendMessageSchema = z.object({
  message: requiredField,
})

export const editProfileSchema = z.object({
  name: optionalField,
  nickname: optionalField,
  avatar_url: optionalField,
})

export const envSchema = z.object({
  NEXTAUTH_URL: envVariable,
  GITHUB_ID: envVariable,
  GITHUB_SECRET: envVariable,
  NEXTAUTH_SECRET: envVariable,
  TWILIO_ACCOUNT_SID: envVariable,
  TWILIO_API_KEY: envVariable,
  TWILIO_API_SECRET: envVariable,
  TWILIO_SERVICE_SID: envVariable,
  TWILIO_CHANNEL_ADMIN: envVariable,
  GIPHY_API_KEY: envVariable,
})
