'use client'

import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-2 p-4">
      <span className="flex h-5 items-center gap-2 text-sm">
        <span>{new Date().getFullYear()}</span>
        <div className="bg-border h-4 w-px" />
        <span className="font-semibold">{siteConfig.name}</span>
      </span>
    </footer>
  )
}
