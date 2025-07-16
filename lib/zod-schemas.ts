import * as z from 'zod'

const requiredField = z.string().trim().nonempty('Required field')
const optionalField = z.string().trim()
const serverEnvVariable = z.string().trim().nonempty()
const clientEnvVariable = z.string().trim().nonempty()

export const loginFormSchema = z.object({
  username: requiredField,
  password: requiredField,
})

export const createChatRoomSchema = z.object({
  name: requiredField.max(40, 'The max length is 40 characters'),
  join_after: z.boolean(),
  description: optionalField.max(100, 'The max length is 100 characters'),
})

export const joinChatRoomSchema = z.object({
  id: requiredField,
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

export const editMessageSchema = z.object({
  body: requiredField,
})

export const serverEnvSchema = z.object({
  NEXTAUTH_URL: serverEnvVariable,
  GITHUB_ID: serverEnvVariable,
  GITHUB_SECRET: serverEnvVariable,
  NEXTAUTH_SECRET: serverEnvVariable,
  TWILIO_ACCOUNT_SID: serverEnvVariable,
  TWILIO_API_KEY: serverEnvVariable,
  TWILIO_API_SECRET: serverEnvVariable,
  TWILIO_SERVICE_SID: serverEnvVariable,
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_TWILIO_CHANNEL_ADMIN: clientEnvVariable,
  NEXT_PUBLIC_GIPHY_API_KEY: clientEnvVariable,
})

export const envClient = clientEnvSchema.parse({
  NEXT_PUBLIC_TWILIO_CHANNEL_ADMIN: process.env.NEXT_PUBLIC_TWILIO_CHANNEL_ADMIN,
  NEXT_PUBLIC_GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,
})

export const editChatSchema = z.object({
  friendlyName: requiredField,
  chatLogoUrl: optionalField,
  description: optionalField.max(100, 'The max length is 100 characters'),
})
