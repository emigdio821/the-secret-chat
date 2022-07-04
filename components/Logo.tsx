import { Flex, Heading } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import styles from 'assets/css/common.module.css'

interface LogoProps {
  bigSize?: boolean
  fixedDir?: boolean
}

export default function Logo({ bigSize = false, fixedDir = false }: LogoProps) {
  return (
    <Flex
      userSelect="none"
      alignItems="center"
      direction={fixedDir ? 'row' : 'column'}
    >
      <BiGhost size={bigSize ? 36 : 22} />
      <Heading size={bigSize ? 'xl' : 'md'} ml={fixedDir ? 1 : 0}>
        The<span style={{ fontWeight: 800 }}>Secret</span>Chat
        <span className={styles['text-blinking']}>_</span>
      </Heading>
    </Flex>
  )
}
