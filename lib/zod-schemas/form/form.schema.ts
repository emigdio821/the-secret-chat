import { z } from 'zod'

const requiredField = z.string().trim().nonempty('Required field')
const optionalField = z.string().trim()

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
  about: optionalField.max(50, 'The max length is 50 characters'),
})

export const editMessageSchema = z.object({
  body: requiredField,
})

// export const serverEnvSchema = z.object({
//   NEXTAUTH_URL: serverEnvVariable,
//   GITHUB_ID: serverEnvVariable,
//   GITHUB_SECRET: serverEnvVariable,
//   NEXTAUTH_SECRET: serverEnvVariable,
//   TWILIO_ACCOUNT_SID: serverEnvVariable,
//   TWILIO_API_KEY: serverEnvVariable,
//   TWILIO_API_SECRET: serverEnvVariable,
//   TWILIO_SERVICE_SID: serverEnvVariable,
//   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
// })

export const editChatSchema = z.object({
  friendlyName: requiredField,
  chatLogoUrl: optionalField,
  description: optionalField.max(100, 'The max length is 100 characters'),
})
