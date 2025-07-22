import { ImageResponse } from 'next/og'

async function loadAssets(): Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> {
  const [{ base64Font: normal }, { base64Font: semibold }] = await Promise.all([
    import('./geist-regular-otf.json').then((mod) => mod.default || mod),
    import('./geist-semibold-otf.json').then((mod) => mod.default || mod),
  ])

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold, 'base64'),
      weight: 600 as const,
      style: 'normal' as const,
    },
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description')
  const [fonts] = await Promise.all([loadAssets()])

  return new ImageResponse(
    (
      <div tw="flex h-full w-full bg-[#121113] text-white" style={{ fontFamily: 'Geist Sans' }}>
        <div tw="flex absolute flex-row bottom-24 right-24 text-[#7c7a85]">
          <svg
            role="img"
            aria-label="Ghost icon"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 10h.01" />
            <path d="M15 10h.01" />
            <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
          </svg>
        </div>
        <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
          <div
            tw="tracking-tight flex-grow-1 flex flex-col justify-center leading-[1.1]"
            style={{
              textWrap: 'balance',
              fontWeight: 600,
              fontSize: title && title.length > 20 ? 64 : 80,
              letterSpacing: '-0.04em',
            }}
          >
            {title}
          </div>
          <div
            tw="text-[40px] leading-[1.5] flex-grow-1 text-[#7c7a85]"
            style={{
              fontWeight: 500,
              textWrap: 'balance',
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts,
    },
  )
}
