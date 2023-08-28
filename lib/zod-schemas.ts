import * as z from 'zod'

const requiredField = z.string().nonempty('Required field')

export const loginFormSchema = z.object({
  username: requiredField,
  password: requiredField,
})
