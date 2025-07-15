'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function Logout() {
  return (
    <DropdownMenuItem onClick={() => signOut({ redirectTo: '/login' })}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}
