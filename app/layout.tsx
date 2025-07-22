import type { Metadata, Viewport } from 'next'
import { fontSans } from '@/config/fonts'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import '@/styles/globals.css'
import { siteConfig } from '@/config/site'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  keywords: siteConfig.keywords,
  description: siteConfig.description,
  creator: 'Emigdio Torres',
  icons: siteConfig.icons,
  openGraph: siteConfig.og,
  metadataBase: new URL(siteConfig.url),
  twitter: siteConfig.ogTwitter,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#121113' },
  ],
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('antialiased', fontSans.className, fontSans.variable)}>
        <Providers>
          <main className="relative flex min-h-dvh flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
