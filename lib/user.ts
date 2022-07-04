export default async function getAccessToken() {
  const res = await fetch('/api/twilio/get-access-token')

  if (!res.ok) throw new Error('Error getting access token')

  const { accessToken } = await res.json()
  return accessToken
}
