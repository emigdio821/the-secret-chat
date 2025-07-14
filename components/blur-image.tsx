'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

export function BlurImage({ alt, ...props }: ImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="bg-muted relative h-full w-full overflow-hidden rounded-[inherit]">
      <Image
        fill
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'rounded-[inherit] object-cover duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'blur-0 scale-100 grayscale-0',
        )}
        onLoad={() => {
          setLoading(false)
        }}
        {...props}
      />
    </div>
  )
}
