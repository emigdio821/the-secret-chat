import type { ParticipantAttributes } from '@/types'
import type { Conversation, Participant } from '@twilio/conversations'
import { AtSignIcon, QuoteIcon, UserIcon, UserXIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertActionDialog } from '../dialogs/alert-action'

interface ParticipantDropdownProps {
  participant: Participant
  chat: Conversation
  withActions?: boolean
}

export function ParticipantDropdown({ participant, chat, withActions = false }: ParticipantDropdownProps) {
  const { data: session } = useSession()
  const user = session?.user
  const isAdmin = user?.email === chat.createdBy
  const partAttrs = participant.attributes as ParticipantAttributes | undefined
  const participantName = partAttrs?.nickname || participant.identity
  const participantAvatarUrl = partAttrs?.avatar_url || AVATAR_FALLBACK_URL

  async function handleKickParticipant(participant: Participant) {
    try {
      await chat.removeParticipant(participant)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[remove_participant]', errMessage)
    }
  }

  return (
    <DropdownMenu key={participant.sid}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="plain" className="truncate">
          <Avatar className="size-4">
            <AvatarImage src={participantAvatarUrl} />
            <AvatarFallback />
          </Avatar>
          {participant.identity === user?.email ? 'You' : participantName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-60">
        <Avatar className="mx-2 mt-2 size-12">
          <AvatarImage src={participantAvatarUrl} />
          <AvatarFallback />
        </Avatar>

        {partAttrs?.name && <DropdownMenuLabel className="text-sm font-semibold">{partAttrs.name}</DropdownMenuLabel>}

        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <AtSignIcon className="text-muted-foreground size-4" />
          <span className="line-clamp-2 flex-1">{participant.identity}</span>
        </DropdownMenuLabel>

        {partAttrs?.nickname && (
          <DropdownMenuLabel className="flex items-center gap-2 pt-0 font-normal">
            <UserIcon className="text-muted-foreground size-4" />
            <span className="line-clamp-2 flex-1">{partAttrs.nickname}</span>
          </DropdownMenuLabel>
        )}

        {partAttrs?.about && (
          <DropdownMenuLabel className="flex items-center gap-2 pt-0 font-normal">
            <QuoteIcon className="text-muted-foreground size-4" />
            <span className="line-clamp-2 flex-1">{partAttrs.about}</span>
          </DropdownMenuLabel>
        )}

        {withActions && isAdmin && participant.identity !== user?.email && (
          <>
            <DropdownMenuSeparator />
            <AlertActionDialog
              title="Kick participant?"
              message={
                <span>
                  You are about to kick <span className="font-semibold">{participantName}</span>.
                </span>
              }
              trigger={
                <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                  <UserXIcon className="size-4" />
                  Kick
                </DropdownMenuItem>
              }
              action={async () => {
                await handleKickParticipant(participant)
              }}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
