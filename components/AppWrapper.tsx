import { Container, Flex } from '@chakra-ui/react'
import Navbar from './Navbar'

interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <Flex direction="column" justify="space-between" h="100vh">
      <Navbar />
      <Container pt={20} maxW="4xl">
        {children}
      </Container>
    </Flex>
  )
}
