'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

function Input({ className, children, type, ...props }: React.ComponentProps<'input'>) {
  const [typeState, setTypeState] = React.useState(type)
  const isPassword = type === 'password'
  const isSearch = type === 'search'

  return (
    <div className="relative w-full">
      <input
        type={isPassword ? typeState : type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          isSearch &&
            'ps-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          className,
        )}
        {...props}
      />
      {isSearch && (
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon className="size-4" />
        </div>
      )}
      {isPassword && (
        <Button
          size="icon"
          type="button"
          variant="unstyled"
          aria-label={typeState === 'password' ? 'Show password' : 'Hide password'}
          onClick={() => setTypeState((prev) => (prev === 'password' ? 'text' : 'password'))}
          className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 h-full px-3 focus:z-10"
        >
          {typeState === 'password' ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
        </Button>
      )}
      {children}
    </div>
  )
}

export { Input }
