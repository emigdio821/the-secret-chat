import { cva, type VariantProps } from 'class-variance-authority'
import { Slot as SlotPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'data-[state=open]:bg-primary/90 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:hover:bg-destructive/80 text-primary-foreground shadow-xs',
        outline:
          'data-[state=open]:bg-accent data-[state=open]:dark:bg-input/50 bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
        secondary:
          'data-[state=open]:bg-secondary/80 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs',
        ghost: 'data-[state=open]:bg-accent hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary hover:underline',
        plain: 'hover:opacity-80 data-[state=open]:opacity-80',
        unstyled: '',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        flat: 'h-auto p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button'
  const flatVariants = ['link', 'unstyled', 'plain']
  const btnSize = size || (variant && flatVariants.includes(variant) ? 'flat' : size)

  return <Comp className={cn(buttonVariants({ variant, size: btnSize, className }))} {...props} />
}

export { Button, buttonVariants, type ButtonProps }
