import { type Metadata } from 'next'

import { siteConfig } from '@/lib/site-config'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: {
    default: 'Login',
    template: `%s · ${siteConfig.name}`,
  },
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return <section className="p-4">{children}</section>
}
