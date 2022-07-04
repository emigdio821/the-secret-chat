import { Client } from '@twilio/conversations'

export default async function createClient(accessToken: string) {
  if (!accessToken) {
    return { error: 'Missing token' }
  }

  return new Client(accessToken)
}
