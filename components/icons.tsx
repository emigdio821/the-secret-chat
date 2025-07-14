import { cn } from '@/lib/utils'
import styles from '@/styles/common.module.css'

interface LoaderProps {
  className?: string
  barsClassName?: string
}

export function Loader({ className, barsClassName }: LoaderProps) {
  return (
    <div className={cn('h-4 w-4', className)}>
      <div className="relative top-1/2 left-1/2 h-[inherit] w-[inherit]">
        {Array.from(Array(12).keys()).map((n) => (
          <div
            key={`loader-bar-${n}`}
            className={cn(
              'animate-loader bg-primary-foreground absolute -top-[3.9%] -left-[10%] h-[8%] w-[24%] rounded-[6px]',
              styles['loader-bar'],
              barsClassName,
            )}
          />
        ))}
      </div>
    </div>
  )
}
