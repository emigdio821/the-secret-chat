import type { ParticipantAttributes } from '@/types'
import type { Participant } from '@twilio/conversations'
import { Keyboard } from 'lucide-react'
import { motion } from 'motion/react'

export function TypingIndicator({ participants }: { participants: Participant[] }) {
  let message: string = ''

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
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -5, opacity: 0 }}
      className="flex w-full justify-center"
    >
      <div className="dark:bg-input/50 bg-background mx-auto mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs backdrop-blur-xs">
        <Keyboard className="size-4 animate-pulse" />
        <span>{message}</span>
      </div>
    </motion.div>
  )
}
