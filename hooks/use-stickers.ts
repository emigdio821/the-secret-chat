import type { GiphyResponse } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GIPHY_STICKERS_QUERY } from '@/lib/constants'

export function useStickers(query: string) {
  async function getStickers({ pageParam = 0 }) {
    try {
      const { data } = await axios.get<GiphyResponse>('/api/giphy/stickers', {
        params: { q: query, offset: pageParam },
      })

      return data
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err
      console.error('[use_stickers]', errMsg)
      throw err
    }
  }

  return useInfiniteQuery({
    queryKey: [GIPHY_STICKERS_QUERY, query],
    queryFn: getStickers,
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
