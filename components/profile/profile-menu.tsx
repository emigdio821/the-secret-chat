import NextLink from 'next/link'
import { User } from 'lucide-react'
import { type Session } from 'next-auth'

import { avatarFallbackUrl } from '@/lib/constants'
import { getFirstName } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Logout } from './profile-menu-logout'

export function ProfileMenu({ session }: { session: Session }) {
  const user = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 pr-1" disabled={!session}>
          <span className="max-w-[64px] truncate">{getFirstName(user?.name ?? '')}</span>
          <Avatar className="h-6 w-6 rounded-sm">
            <AvatarImage src={user?.image ?? avatarFallbackUrl} alt={`${user?.name}`} />
            <AvatarFallback className="h-6 w-6 rounded-sm">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <NextLink href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </NextLink>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <Logout />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
