import { cn } from '@/lib/utils'
import styles from '@/styles/common.module.css'

interface LoaderProps {
  className?: string
  barsClassName?: string
}

export function Loader({ className, barsClassName }: LoaderProps) {
  return (
    <div className={cn('h-4 w-4', className)}>
      <div className="relative left-1/2 top-1/2 h-[inherit] w-[inherit]">
        {Array.from(Array(12).keys()).map((n) => (
          <div
            key={`loader-bar-${n}`}
            className={cn(
              'animate-loader absolute -left-[10%] -top-[3.9%] h-[8%] w-[24%] rounded-[6px] bg-primary-foreground',
              styles['loader-bar'],
              barsClassName,
            )}
          />
        ))}
      </div>
    </div>
  )
}
