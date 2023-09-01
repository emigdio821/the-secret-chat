'use client'

import { useState } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

export function BlurImage({ src }: { src: string }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-muted">
      <Image
        fill
        alt=""
        src={src}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'rounded-[inherit] object-cover duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
        )}
        onLoadingComplete={() => {
          setLoading(false)
        }}
      />
    </div>
  )
}