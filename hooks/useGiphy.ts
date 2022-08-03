import { GiphyFetch } from '@giphy/js-fetch-api'

export default function useGiphy() {
  const gf = new GiphyFetch(process.env.GIPHY_API_KEY as string)
  return gf
}
