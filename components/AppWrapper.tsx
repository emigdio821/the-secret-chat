import { Container } from '@chakra-ui/react'
import Navbar from './Navbar'

interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <>
      <Navbar />
      <Container minH="100vh" maxW="4xl" pt={20}>
        {children}
      </Container>
    </>
  )
}
