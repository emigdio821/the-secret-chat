import type { GiphyResponse } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GIPHY_GIFS_QUERY } from '@/lib/constants'

export function useGifs(query: string) {
  async function getGifs({ pageParam = 0 }) {
    try {
      const { data } = await axios.get<GiphyResponse>('/api/giphy/gifs', {
        params: { q: query, offset: pageParam },
      })

      return data
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[use_gifs]', errMsg)
      throw err
    }
  }

  return useInfiniteQuery({
    queryKey: [GIPHY_GIFS_QUERY, query],
    queryFn: getGifs,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage
      const nextOffset = pagination.offset + pagination.count
      if (nextOffset >= pagination.total_count) return undefined
      return nextOffset
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
