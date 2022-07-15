import { Flex, Heading } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import styles from 'styles/common.module.css'

export default function LoginLogo() {
  return (
    <Flex userSelect="none" alignItems="center" direction="column">
      <BiGhost size={36} />
      <Heading size="xl">
        The<span style={{ fontWeight: 800 }}>Secret</span>Chat
        <span className={styles['text-blinking']}>_</span>
      </Heading>
    </Flex>
  )
}
