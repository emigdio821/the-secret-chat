'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { Icons } from './icons'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider enableSystem disableTransitionOnChange attribute="class" defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-center"
            expand
            icons={{
              error: <CircleAlertIcon className="size-4" />,
              warning: <TriangleAlertIcon className="size-4" />,
              info: <InfoIcon className="size-4" />,
              success: <CircleCheckIcon className="size-4" />,
              loading: <Icons.Spinner />,
            }}
          />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
