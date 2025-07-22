import { NextResponse, type NextRequest } from 'next/server'
import type { GiphyResponse } from '@/types'
import axios from 'axios'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  const offset = Number(req.nextUrl.searchParams.get('offset') ?? '0')
  const endpoint = query ? 'https://api.giphy.com/v1/gifs/search' : 'https://api.giphy.com/v1/gifs/trending'

  try {
    const { data } = await axios.get<GiphyResponse>(endpoint, {
      params: {
        api_key: envServer.GIPHY_API_KEY,
        q: query,
        offset,
        limit: 30,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Giphy API error:', error)
    return NextResponse.json({ error: 'Failed to fetch GIFs' }, { status: 500 })
  }
}
