import { Container } from '@chakra-ui/react'
import Navbar from './Navbar'

interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <>
      <Navbar />
      <Container minH="calc(100vh-100px)" maxW="4xl" pt={20} pb={4}>
        {children}
      </Container>
    </>
  )
}
