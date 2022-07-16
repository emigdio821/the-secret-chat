import { IconButton } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { BiDownArrowAlt } from 'react-icons/bi'

interface ScrollBottomArrowProps {
  isVisible: boolean
  container: HTMLDivElement | null
}

export default function ScrollBottomBtn({
  isVisible,
  container,
}: ScrollBottomArrowProps) {
  function handleClick() {
    container?.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      <motion.div
        key={isVisible ? 'animate' : 'exit'}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, x: 10 }}
        initial={{ opacity: 0, x: 10 }}
        style={{
          zIndex: 1,
          right: '1rem',
          bottom: '1rem',
          position: 'absolute',
        }}
      >
        {isVisible && (
          <IconButton
            size="xs"
            shadow="xl"
            rounded="full"
            colorScheme="purple"
            icon={<BiDownArrowAlt />}
            aria-label="Scroll bottom"
            onClick={() => handleClick()}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
