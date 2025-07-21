import type { IGif } from '@giphy/js-types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GIPHY_GIFS_QUERY } from '@/lib/constants'

export function useGifs(query: string) {
  async function getGifs() {
    try {
      const { data } = await axios.get<IGif[]>('/api/giphy/gifs', {
        params: { q: query },
      })
      return data
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error(GIPHY_GIFS_QUERY, errMsg)
      throw err
    }
  }

  return useQuery({
    queryKey: ['gifs', query],
    queryFn: getGifs,
  })
}
