import { Container } from '@chakra-ui/react'
import Navbar from './Navbar'

interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <>
      <Navbar />
      <Container pt={20} maxW="4xl" h="100vh" minH={{ base: 600, sm: 800 }}>
        {children}
      </Container>
    </>
  )
}
