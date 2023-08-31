import { useState } from 'react'
import { type ParticipantAttributes } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { type Conversation, type Participant } from '@twilio/conversations'
import { AnimatePresence } from 'framer-motion'
import { AtSign, Shield, User, UserX } from 'lucide-react'
import { type Session } from 'next-auth'

import { ACTIVE_PARTICIPANTS_QUERY, AVATAR_FALLBACK_URL } from '@/lib/constants'
import { sortArray } from '@/lib/utils'
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
import { ControlledAlertDialog } from '@/components/controlled-alert-dialog'

interface ChatParticipantsProps {
  chat: Conversation
  session: Session
}

export function ChatParticipants({ chat, session }: ChatParticipantsProps) {
  const [openedAlert, setOpenedAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { data: participants, isLoading: isLoadingParts } = useQuery(
    [ACTIVE_PARTICIPANTS_QUERY],
    getParticipants,
  )
  const user = session.user
  const isAdmin = user?.email === chat.createdBy

  async function getParticipants() {
    try {
      const participants = await chat.getParticipants()
      return participants
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_PARTICIPANTS]', errMessage)
      return null
    }
  }

  async function handleKickParticipant(participant: Participant) {
    try {
      setLoading(true)
      await chat.removeParticipant(participant)
      setOpenedAlert(false)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[REMOVE_PARTICIPANT]', errMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="h-20 w-full overflow-auto rounded-lg border sm:h-[420px] sm:w-36">
        <div className="flex h-full w-full flex-row items-center gap-1 p-4 sm:flex-col">
          {isLoadingParts && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-2 w-4/5" />
              <Skeleton className="h-2 w-4/5" />
              <Skeleton className="h-2 w-full" />
            </div>
          )}
          {participants &&
            participants.length > 0 &&
            sortArray({
              key: 'identity',
              items: participants,
              comparator: user?.email ?? '',
            }).map((participant) => {
              const attrs = participant.attributes as unknown as ParticipantAttributes

              return (
                <div className="text-xs sm:w-full" key={participant.sid}>
                  {participant.identity === user?.email ? (
                    <div className="flex h-8 items-center gap-2 rounded-md px-1">
                      <Avatar className="h-5 w-5 rounded-sm">
                        <AvatarImage
                          alt={`${user?.name}`}
                          className="object-cover"
                          src={attrs.avatar_url ?? AVATAR_FALLBACK_URL}
                        />
                        <AvatarFallback className="h-6 w-6 rounded-sm">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">You</span>
                    </div>
                  ) : (
                    <AnimatePresence key={participant.sid}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="gap-2 px-1 sm:w-full sm:justify-start"
                            disabled={!session}
                          >
                            <Avatar className="h-5 w-5 rounded-sm">
                              <AvatarImage
                                alt={`${user?.name}`}
                                className="object-cover"
                                src={attrs.avatar_url ?? AVATAR_FALLBACK_URL}
                              />
                              <AvatarFallback className="h-6 w-6 rounded-sm">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="max-w-[72px] truncate">
                              {attrs.nickname ?? participant.identity}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-w-[180px]">
                          <Avatar className="mx-2 my-1.5 h-10 w-10 rounded-lg">
                            <AvatarImage
                              src={user?.image ?? AVATAR_FALLBACK_URL}
                              alt={`${user?.name}`}
                            />
                            <AvatarFallback className="h-6 w-6 rounded-sm">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <DropdownMenuLabel>User info</DropdownMenuLabel>
                          <DropdownMenuLabel className="flex items-center gap-2">
                            <AtSign className="h-4 w-4" />
                            {participant.identity}
                          </DropdownMenuLabel>
                          {attrs.name && (
                            <DropdownMenuLabel className="flex items-center gap-2 pt-0 text-xs">
                              {attrs.name}
                            </DropdownMenuLabel>
                          )}
                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuGroup>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  <span>Make admin</span>
                                </DropdownMenuItem>
                                <ControlledAlertDialog
                                  open={openedAlert}
                                  isLoading={isLoading}
                                  setOpen={setOpenedAlert}
                                  action={async () => {
                                    await handleKickParticipant(participant)
                                  }}
                                  trigger={
                                    <DropdownMenuItem
                                      className="!text-destructive"
                                      onSelect={(e) => {
                                        e.preventDefault()
                                        setOpenedAlert(true)
                                      }}
                                    >
                                      <UserX className="mr-2 h-4 w-4" />
                                      <span>Kick</span>
                                    </DropdownMenuItem>
                                  }
                                  alertMessage={
                                    <>
                                      This action cannot be undone. You are about to kick{' '}
                                      <span className="font-semibold">{`"${participant.identity}".`}</span>
                                    </>
                                  }
                                />
                              </DropdownMenuGroup>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </AnimatePresence>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
