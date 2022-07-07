import { motion } from 'framer-motion'

interface MotionDivProps {
  children: React.ReactNode
}

export default function MotionDiv({ children }: MotionDivProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: -10 }}
    >
      {children}
    </motion.div>
  )
}
