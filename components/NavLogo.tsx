import { Flex, Heading } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import styles from 'styles/common.module.css'
import { useRouter } from 'next/router'

export default function NavLogo() {
  const router = useRouter()

  function handleHomeClick() {
    if (router.pathname === '/') return
    router.push('/')
  }

  return (
    <Flex
      direction="row"
      cursor="pointer"
      userSelect="none"
      alignItems="center"
      onClick={() => handleHomeClick()}
    >
      <BiGhost size={22} />
      <Heading size="md" ml={1}>
        The<span style={{ fontWeight: 800 }}>Secret</span>Chat
        <span className={styles['text-blinking']}>_</span>
      </Heading>
    </Flex>
  )
}
