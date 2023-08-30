import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type Conversation, type Participant } from '@twilio/conversations'
import { AnimatePresence } from 'framer-motion'
import { AtSign, Shield, User, UserX } from 'lucide-react'
import { type Session } from 'next-auth'

import { AVATAR_FALLBACK_URL, PARTICIPANTS_QUERY } from '@/lib/constants'
import { sortArray } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader } from '@/components/icons'

interface ChatParticipantsProps {
  chat: Conversation
  session: Session
}

export function ChatParticipants({ chat, session }: ChatParticipantsProps) {
  const [openedAlert, setOpenedAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { data: participants, isLoading: isLoadingParts } = useQuery(
    [PARTICIPANTS_QUERY],
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
      <ScrollArea className="h-20 w-full rounded-lg border sm:h-[420px] sm:w-36">
        <div className="flex flex-col gap-1 p-4">
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
              items: participants,
              sortBy: 'identity',
              sortByValue: user?.email ?? '',
            }).map((participant) => (
              <div className="text-xs" key={participant.sid}>
                {participant.identity === user?.email ? (
                  <div className="flex h-8 items-center gap-2 rounded-md border pl-1 pr-3">
                    <Avatar className="h-5 w-5 rounded-sm">
                      <AvatarImage src={user?.image ?? AVATAR_FALLBACK_URL} alt={`${user?.name}`} />
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
                          variant="outline"
                          size="xs"
                          className="gap-2 pl-1"
                          disabled={!session}
                        >
                          <Avatar className="h-5 w-5 rounded-sm">
                            <AvatarImage
                              src={user?.image ?? AVATAR_FALLBACK_URL}
                              alt={`${user?.name}`}
                            />
                            <AvatarFallback className="h-6 w-6 rounded-sm">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[64px] truncate">{participant.identity}</span>
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
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Make admin</span>
                              </DropdownMenuItem>
                              <AlertDialog
                                open={openedAlert}
                                onOpenChange={(isOpen) => {
                                  if (!isLoading) {
                                    setOpenedAlert(isOpen)
                                  }
                                }}
                              >
                                <AlertDialogTrigger asChild>
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
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. You are about to kick{' '}
                                      <span className="font-semibold">{`"${participant.identity}".`}</span>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      disabled={isLoading}
                                      onClick={async (e) => {
                                        e.preventDefault()
                                        await handleKickParticipant(participant)
                                      }}
                                    >
                                      Continue
                                      {isLoading && <Loader className="ml-2" />}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuGroup>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </AnimatePresence>
                )}
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}
