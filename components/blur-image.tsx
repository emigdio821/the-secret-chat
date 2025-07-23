'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface BlurImageProps extends ImageProps {
  transparent?: boolean
}

export function BlurImage({ alt, transparent = false, className, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div
      className={cn('bg-muted relative h-full w-full overflow-hidden rounded-[inherit]', {
        'bg-transparent': transparent,
      })}
    >
      <Image
        fill
        alt={alt}
        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'rounded-[inherit] object-cover duration-700 ease-in-out',
          isLoading ? 'scale-110 opacity-25 blur-xl grayscale-50' : 'blur-0 scale-100 opacity-100',
          className,
        )}
        onLoad={() => {
          setLoading(false)
        }}
        {...props}
      />
    </div>
  )
}
