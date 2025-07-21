import { GiphyFetch } from '@giphy/js-fetch-api'
import { envClient } from '@/lib/zod-schemas/env/client.schema'

export function useGiphy() {
  return new GiphyFetch(envClient.NEXT_PUBLIC_GIPHY_API_KEY)
}
