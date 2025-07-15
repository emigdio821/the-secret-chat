import type { ParticipantAttributes } from '@/types'
import { useToggle } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import type { Client, Conversation, Participant } from '@twilio/conversations'
import { AtSign, Signal, UserIcon, UserX } from 'lucide-react'
import type { Session } from 'next-auth'
import { ACTIVE_PARTICIPANTS_QUERY, AVATAR_FALLBACK_URL } from '@/lib/constants'
import { cn, sortArray } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { ControlledAlertDialog } from '@/components/controlled-alert-dialog'
import ChatActions from './chat-actions'

interface ChatParticipantsProps {
  chat: Conversation
  session: Session
  client: Client
}

export function ChatParticipants({ chat, session, client }: ChatParticipantsProps) {
  const [openedAlert, setOpenedAlert] = useToggle()
  const [isLoading, setLoading] = useToggle()
  const { data: participants, isLoading: isLoadingParts } = useQuery({
    queryKey: [ACTIVE_PARTICIPANTS_QUERY],
    queryFn: getParticipants,
  })
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

  // async function handleMakeAdmin(participant: Participant) {
  //   try {
  //     participant._update({
  //       roleSid: process.env.NEXT_PUBLIC_TWILIO_CHANNEL_ADMIN,
  //     })
  //   } catch (err) {
  //     const errMessage = err instanceof Error ? err.message : err
  //     console.log('[MAKE_ADMIN_PARTICIPANT]', errMessage)
  //   }
  // }

  return (
    <div className="relative flex h-16 w-full items-center justify-between rounded-lg border sm:h-[420px] sm:w-36">
      <div className="h-full w-full overflow-auto">
        <div className="flex h-full w-full flex-row items-center gap-1 px-4 py-2 sm:flex-col sm:p-4">
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
              const partAttrs = participant.attributes as ParticipantAttributes

              return (
                <div className="text-xs sm:w-full" key={participant.sid}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        disabled={!user}
                        className={cn('gap-2 px-1 sm:w-full sm:justify-start', {
                          'opacity-50': !partAttrs?.isOnline,
                        })}
                      >
                        <div className="relative h-5 w-5 rounded-sm">
                          <Avatar className="h-full w-full rounded-[inherit]">
                            <AvatarImage
                              alt={`${user?.name}`}
                              className="object-cover"
                              src={partAttrs?.avatar_url || AVATAR_FALLBACK_URL}
                            />
                            <AvatarFallback className="h-6 w-6 rounded-sm">
                              <UserIcon className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              'border-card absolute -right-[2px] -bottom-[2px] h-2 w-2 rounded-full border bg-zinc-400',
                              {
                                'bg-green-400': partAttrs?.isOnline,
                              },
                            )}
                          />
                        </div>
                        <span className="max-w-[72px] truncate">
                          {participant.isTyping
                            ? 'Typing...'
                            : participant.identity === user?.email
                              ? 'You'
                              : partAttrs?.nickname || participant.identity}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="max-w-[240px] p-1">
                      <Avatar className="mx-2 my-1.5 h-20 w-20 rounded-lg">
                        <AvatarImage
                          alt={`${user?.name}`}
                          className="object-cover"
                          src={partAttrs?.avatar_url || AVATAR_FALLBACK_URL}
                        />
                        <AvatarFallback className="h-20 w-20 rounded-sm">
                          <UserIcon className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      {partAttrs?.name && (
                        <DropdownMenuLabel className="flex items-center gap-2 text-base">
                          {partAttrs?.name}
                        </DropdownMenuLabel>
                      )}
                      <DropdownMenuLabel
                        className={cn('flex items-center gap-2 font-normal', {
                          'pt-0': partAttrs?.name,
                          'pb-0': partAttrs?.nickname,
                        })}
                      >
                        <AtSign className="h-4 w-4" />
                        <span className="break-all">{participant.identity}</span>
                      </DropdownMenuLabel>
                      {partAttrs?.nickname && (
                        <DropdownMenuLabel className="flex items-center gap-2 py-0 font-normal">
                          <UserIcon className="size-4" />
                          {partAttrs?.nickname}
                        </DropdownMenuLabel>
                      )}
                      <DropdownMenuLabel className="flex items-center gap-2 pt-0 font-normal">
                        <Signal className="h-4 w-4" />
                        {partAttrs?.isOnline ? 'Online' : 'Offline'}
                      </DropdownMenuLabel>
                      {isAdmin && participant.identity !== user?.email && (
                        <>
                          <DropdownMenuSeparator />
                          <section className="flex flex-col">
                            {/* <Button
                                onClick={async () => {
                                  await handleMakeAdmin(participant)
                                }}
                                variant="dropdown"
                                className="h-full justify-start px-2 py-1.5"
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Make admin</span>
                              </Button> */}
                            <ControlledAlertDialog
                              open={openedAlert}
                              isLoading={isLoading}
                              setOpen={setOpenedAlert}
                              action={async () => {
                                await handleKickParticipant(participant)
                              }}
                              trigger={
                                <Button
                                  className="text-destructive! h-full justify-start px-2 py-1.5"
                                  onClick={() => {
                                    setOpenedAlert(true)
                                  }}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  <span>Kick</span>
                                </Button>
                              }
                              alertMessage={
                                <>
                                  This action cannot be undone. You are about to kick{' '}
                                  <span className="font-semibold">{`"${participant.identity}".`}</span>
                                </>
                              }
                            />
                          </section>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )
            })}
        </div>
      </div>
      <span className="px-4 py-2 sm:hidden">
        <ChatActions chat={chat} client={client} />
      </span>
    </div>
  )
}
