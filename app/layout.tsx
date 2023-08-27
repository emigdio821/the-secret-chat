import { cn } from '@/lib/utils'
import Footer from '@/components/footer'
import { Providers } from '@/components/providers'

import '@/styles/globals.css'

import { fontSans } from '@/lib/fonts'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'bg-background relative flex min-h-screen flex-col font-sans antialiased ',
            fontSans.variable,
          )}
        >
          <Providers>
            <main>{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </>
  )
}
