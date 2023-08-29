import * as z from 'zod'

const requiredField = z.string().nonempty('Required field')
const optionalField = z.string()

export const loginFormSchema = z.object({
  username: requiredField,
  password: requiredField,
})

export const createChatRoomSchema = z.object({
  name: requiredField,
  join_after: z.boolean().default(false),
  description: optionalField.max(100, 'The max length is 100 character(s)'),
})

export const joinChatRoomSchema = z.object({
  name: requiredField,
})

export const sendMessageSchema = z.object({
  message: requiredField,
})
