import { cn } from '@/lib/utils'

function TypographyH4({ className, ...props }: React.ComponentProps<'h4'>) {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
}

function InlineCode({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn('bg-muted relative rounded-md px-1 py-0.5 font-mono text-sm font-semibold', className)}
      {...props}
    />
  )
}
export { TypographyH4, InlineCode }
