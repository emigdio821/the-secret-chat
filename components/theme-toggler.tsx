'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const THEMES = ['light', 'dark', 'system']

export function ThemeToggler() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <MoonIcon className="block h-[1em] w-[1em] dark:hidden" />
          <SunIcon className="hidden h-[1em] w-[1em] dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((themeName) => (
          <DropdownMenuCheckboxItem
            key={themeName}
            className="capitalize"
            checked={themeName === theme}
            onClick={() => {
              setTheme(themeName)
            }}
          >
            {themeName}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
