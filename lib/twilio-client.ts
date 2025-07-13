import { Client } from '@twilio/conversations'

async function getToken() {
  try {
    const res = await fetch('/api/twilio/token')
    const data = await res.json()

    return data.access_token
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : err
    console.log('[GET_TOKEN]', errMessage)
  }
}

export async function initClient() {
  try {
    const token = await getToken()
    return new Client(token)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : err
    console.log('[INIT_CLIENT]', errMessage)
    return await Promise.reject(errMessage)
  }
}
