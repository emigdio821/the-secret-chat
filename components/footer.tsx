import { siteConfig } from '../lib/site-config'
import { ThemeToggler } from './theme-toggler'

export default function Footer() {
  return (
    <footer className="mx-auto mt-auto flex max-w-2xl gap-2 p-4">
      <span className="flex items-center gap-1 text-sm">
        <span className="font-semibold">{new Date().getFullYear()}</span>· {siteConfig.name}
      </span>
      <ThemeToggler />
    </footer>
  )
}
