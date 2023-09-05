import { type ParticipantAttributes } from '@/types'
import { type Participant } from '@twilio/conversations'
import { motion } from 'framer-motion'
import { Keyboard } from 'lucide-react'

export function TypingIndicator({ participants }: { participants: Participant[] }) {
  let message

  if (participants.length === 1) {
    const attrs = participants[0].attributes as ParticipantAttributes
    message = `${attrs.nickname ?? participants[0].identity} is typing...`
  } else if (participants.length > 1) {
    message = `${participants.length} participants are typing...`
  } else {
    message = 'Somebody is typing...'
  }
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -5 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex w-full justify-center"
    >
      <div className="mx-auto flex items-center gap-1 rounded-b-lg border bg-background/80 px-3 py-2 text-xs backdrop-blur-sm">
        <Keyboard className="h-4 w-4 animate-pulse" />
        <span>{message}</span>
      </div>
    </motion.div>
  )
}
