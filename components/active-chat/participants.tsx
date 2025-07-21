import type { Conversation } from '@twilio/conversations'
import { BugIcon, RotateCwIcon, UsersIcon } from 'lucide-react'
import { useChatParticipants } from '@/hooks/chat/use-chat-participants'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '../ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { TypographyH4 } from '../ui/typography'
import { ParticipantDropdown } from './participant-dropdown'

interface ChatParticipantsProps {
  chat: Conversation
}

export function ChatParticipants({ chat }: ChatParticipantsProps) {
  const { data: participants, isLoading, error, refetch } = useChatParticipants(chat)

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription className="text-center">
            Something went wrong while fetching the chat participants.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RotateCwIcon className="size-4" />
            Refetch participants
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <UsersIcon className="text-muted-foreground size-4" />
        <span className="text-sm leading-none font-semibold">Participants</span>
        <Badge variant="secondary">{participants?.length ?? 0}</Badge>
      </div>
      {isLoading ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex h-9 w-40 items-center justify-center gap-2 px-3 py-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-2 grow" />
          </div>
          <div className="flex h-9 w-44 items-center justify-center gap-2 px-3 py-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-2 grow" />
          </div>
          <div className="flex h-9 w-48 items-center justify-center gap-2 px-3 py-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-2 grow" />
          </div>
        </div>
      ) : (
        participants && (
          <div className="-m-2 flex max-h-[200px] flex-col items-start gap-2 overflow-y-auto p-2">
            {participants.map((participant) => (
              <ParticipantDropdown key={participant.sid} participant={participant} chat={chat} withActions />
            ))}
          </div>
        )
      )}
    </div>
  )
}
