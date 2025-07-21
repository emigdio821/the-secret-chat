import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  AUTH_SECRET: z.string().nonempty(),
  AUTH_URL: z.string().nonempty(),
  AUTH_GITHUB_ID: z.string().nonempty(),
  AUTH_GITHUB_SECRET: z.string().nonempty(),
  TWILIO_API_KEY: z.string().nonempty(),
  TWILIO_API_SECRET: z.string().nonempty(),
  TWILIO_ACCOUNT_SID: z.string().nonempty(),
  TWILIO_SERVICE_SID: z.string().nonempty(),
  TWILIO_AUTH_TOKEN: z.string().nonempty(),
})

export const envServer = envSchema.parse(process.env)
