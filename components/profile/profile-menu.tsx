'use client'

import NextLink from 'next/link'
import { type UserAttributes } from '@/types'
import { Github, User } from 'lucide-react'
import { type Session } from 'next-auth'

import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { siteConfig } from '@/lib/site-config'
import { getFirstName } from '@/lib/utils'
import { useTwilioClient } from '@/hooks/use-twilio-client'
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
import { Skeleton } from '@/components/ui/skeleton'

import { Logout } from './profile-menu-logout'

export function ProfileMenu({ session }: { session: Session }) {
  const user = session.user
  const { client, isLoading } = useTwilioClient()
  const userAttrs = client?.user.attributes as unknown as UserAttributes

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 pr-1" disabled={!session}>
          <span className="max-w-[64px] truncate">{getFirstName(user?.name ?? '')}</span>
          {isLoading ? (
            <Skeleton className="h-6 w-6 rounded-sm" />
          ) : (
            <Avatar className="h-6 w-6 rounded-sm">
              <AvatarImage
                alt={`${user?.name}`}
                className="object-cover"
                src={userAttrs?.avatar_url || AVATAR_FALLBACK_URL}
              />
              <AvatarFallback className="h-6 w-6 rounded-sm">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[180px]">
        <DropdownMenuLabel>
          {(userAttrs?.name || session.user?.name) ?? client?.user.identity}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <NextLink href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </NextLink>
          <NextLink href={siteConfig.links.sourceCode} target="_blank">
            <DropdownMenuItem>
              <Github className="mr-2 h-4 w-4" />
              <span>Source</span>
            </DropdownMenuItem>
          </NextLink>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Logout />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
