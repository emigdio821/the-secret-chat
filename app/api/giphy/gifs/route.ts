import { NextResponse, type NextRequest } from 'next/server'
import type { IGif } from '@giphy/js-types'
import axios from 'axios'
import { envServer } from '@/lib/zod-schemas/env/server.schema'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  const limit = req.nextUrl.searchParams.get('limit') || '24'

  const endpoint = query ? 'https://api.giphy.com/v1/gifs/search' : 'https://api.giphy.com/v1/gifs/trending'

  try {
    const { data } = await axios.get<{ data: IGif[] }>(endpoint, {
      params: {
        api_key: envServer.GIPHY_API_KEY,
        q: query ?? undefined,
        limit,
      },
    })

    return NextResponse.json(data.data)
  } catch (error) {
    console.error('Giphy API error:', error)
    return NextResponse.json({ error: 'Failed to fetch GIFs' }, { status: 500 })
  }
}
