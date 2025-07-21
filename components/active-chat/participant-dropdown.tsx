import type { ParticipantAttributes } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation, Participant } from '@twilio/conversations'
import axios from 'axios'
import { AtSignIcon, QuoteIcon, ShieldIcon, UserIcon, UserXIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import type { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant'
import { AVATAR_FALLBACK_URL, IS_ADMIN_QUERY } from '@/lib/constants'
import { useIsChatAdmin } from '@/hooks/chat/use-is-admin'
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
  chat: Conversation
  withActions?: boolean
  participant: Participant | ParticipantInstance
}

export function ParticipantDropdown({ participant, chat, withActions = false }: ParticipantDropdownProps) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user
  const partAttrs =
    typeof participant.attributes === 'string'
      ? (JSON.parse(participant.attributes) as ParticipantAttributes | undefined)
      : (participant.attributes as ParticipantAttributes | undefined)
  const participantName = partAttrs?.nickname || participant.identity
  const participantAvatarUrl = partAttrs?.avatar_url || AVATAR_FALLBACK_URL
  const { data: isAdmin } = useIsChatAdmin(chat.sid, user?.email || '')

  async function handleKickParticipant() {
    try {
      await chat.removeParticipant(participant.sid)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[remove_participant]', errMessage)
    }
  }

  async function handleMakeAdminParticipant() {
    try {
      await axios.post('/api/twilio/toggle-admin', {
        chatId: chat.sid,
        participantId: participant.sid,
      })

      await queryClient.invalidateQueries({ queryKey: [IS_ADMIN_QUERY, chat.sid, participant.identity] })
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[make_admin_participant]', errMessage)
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
              title="Make admin?"
              message={
                <span>
                  You are about to make <span className="font-semibold">{participantName}</span> and admin.
                </span>
              }
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ShieldIcon className="size-4" />
                  Make admin
                </DropdownMenuItem>
              }
              action={async () => {
                await handleMakeAdminParticipant()
              }}
            />
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
                await handleKickParticipant()
              }}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
