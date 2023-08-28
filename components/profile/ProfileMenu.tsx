'use client'

import NextLink from 'next/link'
import { LogOut, User } from 'lucide-react'
import { type Session } from 'next-auth'
// import useCleanup from 'hooks/useCleanup'
import { signOut, useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
// import { BiChevronDown, BiHomeSmile, BiLogOut, BiMoon, BiSun, BiUser } from 'react-icons/bi'
// import { FaGithub } from 'react-icons/fa'
// import { getFirstName } from 'utils'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileMenu({ session }: { session: Session }) {
  // const router = useRouter()
  // const { data } = useSession()
  // const { user } = data || {}
  // const { toggleColorMode } = useColorMode()
  // const bg = useColorModeValue('#fafafa', '#262626')
  // const bgHover = useColorModeValue('gray.100', 'whiteAlpha.100')
  // const SwitchIcon = useColorModeValue(BiMoon, BiSun)
  // const themeMode = useColorModeValue('Dark', 'Light')
  // const cleanUp = useCleanup()
  // const btnHover = useColorModeValue('#fff', '#222')
  // const btnBg = useColorModeValue('#fafafa', '#262626')
  // const btnColor = useColorModeValue('#333', '#fafafa')

  // function handleHomeClick() {
  //   cleanUp()
  //   router.push('/')
  // }
  const user = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {user?.name?.split(' ')[0]}
          <Avatar className="h-4 w-4 rounded-sm">
            <AvatarImage src={user?.image ?? ''} alt={`${user?.name}`} />
            <AvatarFallback className="rounded-sm bg-transparent">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <NextLink href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </NextLink>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              await signOut({ callbackUrl: '/login' })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    // <Box>
    //   <Menu>
    //     <MenuButton
    //       px={2}
    //       bg={btnBg}
    //       as={Button}
    //       rounded="full"
    //       color={btnColor}
    //       isDisabled={!user}
    //       _hover={{
    //         bg: btnHover,
    //       }}
    //       _active={{
    //         bg: btnHover,
    //       }}
    //       rightIcon={<BiChevronDown size={20} />}
    //     >
    //       {!user ? (
    //         <VStack w="100%" h="100%" bg="#333" justify="center">
    //           <Spinner />
    //         </VStack>
    //       ) : (
    //         <Stack alignItems="center" direction="row">
    //           <Avatar size="xs" bg="gray.900" src={user.image || ''} name={user.name || ''} />
    //           {user.name && (
    //             <Text noOfLines={1} display={{ base: 'none ', sm: 'inherit' }}>
    //               {getFirstName(user.name)}
    //             </Text>
    //           )}
    //         </Stack>
    //       )}
    //     </MenuButton>
    //     <MenuList px={2} shadow="xl" bg={useColorModeValue('#fafafa', '#262626')}>
    //       <MenuGroup title={user?.name || undefined}>
    //         {router.pathname !== '/' && (
    //           <MenuItem
    //             fontSize="sm"
    //             onClick={() => handleHomeClick()}
    //             icon={<BiHomeSmile size={16} />}
    //           >
    //             <Text>Home</Text>
    //           </MenuItem>
    //         )}
    //         {router.pathname !== '/profile' && (
    //           <NextLink href="/profile" passHref>
    //             <MenuItem fontSize="sm" icon={<BiUser size={16} />}>
    //               My profile
    //             </MenuItem>
    //           </NextLink>
    //         )}
    //       </MenuGroup>
    //       <MenuItem fontSize="sm" onClick={toggleColorMode} icon={<SwitchIcon size={16} />}>
    //         <Text>{themeMode} theme</Text>
    //       </MenuItem>
    //       <MenuDivider />
    //       <ChakraMenuItem
    //         as="a"
    //         fontSize="sm"
    //         target="_blank"
    //         _hover={{
    //           bg: bgHover,
    //         }}
    //         bg={bg}
    //         rounded="md"
    //         rel="noopener noreferrer"
    //         icon={<FaGithub size={16} />}
    //         href="https://github.com/emigdio821/the-secret-chat"
    //       >
    //         <Text>Source</Text>
    //       </ChakraMenuItem>
    //       <MenuDivider />
    //       <MenuItem
    //         fontSize="sm"
    //         onClick={() =>
    //           signOut({
    //             callbackUrl: '/login',
    //           })
    //         }
    //         icon={<BiLogOut size={16} color="#ff6961" />}
    //       >
    //         <Text color="#ff6961">Log out</Text>
    //       </MenuItem>
    //     </MenuList>
    //   </Menu>
    // </Box>
  )
}
