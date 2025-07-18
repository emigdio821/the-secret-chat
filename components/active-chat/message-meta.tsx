import type { MessageAttributes, ParticipantAttributes } from '@/types'
import type { Media } from '@twilio/conversations'
import { formatDate } from '@/lib/utils'

interface MessageMetaProps {
  isGif: boolean | undefined
  author: string | null
  isAuthor: boolean
  dateCreated: Date | null
  msgAttrs: MessageAttributes | undefined
  partAttrs: ParticipantAttributes | undefined
  rawMedia: Media | undefined
}

export function MessageMeta(props: MessageMetaProps) {
  const { dateCreated, isGif, msgAttrs, partAttrs, author, rawMedia, isAuthor } = props

  return (
    <div className="text-muted-foreground mt-2 flex flex-col text-[11px]">
      <span>
        {dateCreated && <span>{formatDate(dateCreated)}</span>}
        {isGif && ' · (via GIPHY)'}
        {msgAttrs?.isEdited && ' · (edited)'}
        {rawMedia?.contentType && ` · (${rawMedia?.contentType})`}
      </span>

      {!isAuthor && <span>{partAttrs?.nickname ?? author}</span>}
    </div>
  )
}
