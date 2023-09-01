import { GiphyFetch } from '@giphy/js-fetch-api'

// import { envSchema } from '@/lib/zod-schemas'

export function useGiphy() {
  // const env = envSchema.parse(process.env)
  return new GiphyFetch(process.env.GIPHY_API_KEY as string)
}
