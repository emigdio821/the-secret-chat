import { Client } from '@twilio/conversations'

import getAccessToken from './user'

export async function createClient(accessToken: string) {
  return new Client(accessToken)
}

export async function initClient() {
  try {
    const accessToken = await getAccessToken()
    const twilioClient = await createClient(accessToken)
    return twilioClient
  } catch (err) {
    return await Promise.reject(err)
  }
}
