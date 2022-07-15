import { Box, Flex, useColorModeValue, Stack } from '@chakra-ui/react'
import NavLogo from './NavLogo'
import ProfileMenu from './ProfileMenu'

export default function Navbar() {
  return (
    <Box
      as="nav"
      w="100%"
      zIndex={1}
      position="fixed"
      css={{
        backdropFilter: 'blur(10px)',
      }}
      bg={useColorModeValue(
        'rgba(237, 237, 237, 0.9)',
        'rgba(20, 20, 20, 0.9)',
      )}
    >
      <Flex
        h={16}
        px={4}
        maxW="4xl"
        m="0 auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Flex alignItems="center">
            <NavLogo />
          </Flex>
        </Box>
        <Stack alignItems="center" direction="row">
          <ProfileMenu />
        </Stack>
      </Flex>
    </Box>
  )
}
