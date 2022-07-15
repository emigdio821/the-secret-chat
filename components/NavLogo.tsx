import { Flex, Heading } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import styles from 'styles/common.module.css'
import NextLink from 'next/link'

export default function NavLogo() {
  return (
    <NextLink href="/" passHref>
      <Flex
        direction="row"
        cursor="pointer"
        userSelect="none"
        alignItems="center"
      >
        <BiGhost size={22} />
        <Heading size="md" ml={1}>
          The<span style={{ fontWeight: 800 }}>Secret</span>Chat
          <span className={styles['text-blinking']}>_</span>
        </Heading>
      </Flex>
    </NextLink>
  )
}
