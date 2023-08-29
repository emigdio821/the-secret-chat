import * as z from 'zod'

const requiredField = z.string().trim().nonempty('Required field')
const optionalField = z.string().trim()

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

export const sendMessageSchema = z.object({
  message: requiredField,
})
