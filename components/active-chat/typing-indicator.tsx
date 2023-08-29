import { type Participant } from '@twilio/conversations'
import { motion } from 'framer-motion'
import { Keyboard } from 'lucide-react'

export function TypingIndicator({ participants }: { participants: Participant[] }) {
  const message =
    participants.length > 1
      ? `${participants.length} participants are typing...`
      : `${participants[0].identity} is typing...`

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -5 }}
      exit={{ opacity: 0, y: -5 }}
      className="absolute top-0 flex w-full justify-center"
    >
      <div className="mx-auto flex items-center gap-1 rounded-b-lg border border-t-0 bg-background/80 px-3 py-2 text-xs backdrop-blur-sm">
        <Keyboard className="h-4 w-4 animate-pulse" />
        <span>{message}</span>
      </div>
    </motion.div>
  )
}