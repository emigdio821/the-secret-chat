import { Client } from '@twilio/conversations'

export default async function createClient(accessToken: string) {
  return new Client(accessToken)
}
