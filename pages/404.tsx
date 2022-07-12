import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { BiGhost, BiArrowBack } from 'react-icons/bi'
import Link from 'next/link'
import Helmet from 'components/Helmet'

export default function NotFound() {
  return (
    <Flex
      maxW="4xl"
      margin="0 auto"
      pt={{ base: 10, sm: 20 }}
      minH={{ base: 'calc(100vh - 222px)', sm: 'calc(100vh - 150px)' }}
    >
      <Helmet title="Not found" />
      <VStack px={{ base: 4, lg: 0 }} justify="center" w="100%">
        <Box
          w="100%"
          rounded="xl"
          py={{ base: 10, sm: 20 }}
          bg={useColorModeValue('#EDEDED', '#2e2e2e')}
        >
          <Box textAlign="center" w="100%">
            <Icon as={BiGhost} fontSize="5rem" />
            <Heading fontSize="3xl">Not found</Heading>
            <Text fontSize="xl">Page does not exist.</Text>
            <Link href="/">
              <Button mt={10} leftIcon={<BiArrowBack />}>
                Back to home
              </Button>
            </Link>
          </Box>
        </Box>
      </VStack>
    </Flex>
  )
}
