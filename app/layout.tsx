import { type Metadata } from 'next'

import { cn } from '@/lib/utils'
import Footer from '@/components/footer'
import { Providers } from '@/components/providers'

import '@/styles/globals.css'

import { fontSans } from '@/lib/fonts'
import { siteConfig } from '@/lib/site-config'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  authors: [
    {
      name: 'Emigdio Torres',
      url: siteConfig.url,
    },
  ],
  metadataBase: new URL(siteConfig.url),
  creator: 'Emigdio Torres',
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon-16x16.png',
    apple: '/images/apple-touch-icon.png',
  },
  viewport: {
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    height: 'device-height',
    width: 'device-width',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'en-US',
    type: 'website',
    images: siteConfig.ogUrl,
  },
  // robots: '/robots.txt',
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'relative flex min-h-screen flex-col bg-background font-sans antialiased ',
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
