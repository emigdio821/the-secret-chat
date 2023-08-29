'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from 'react-query'

import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
