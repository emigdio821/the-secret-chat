import {
  Box,
  Text,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { Message } from '@twilio/conversations'
import { BiDotsVerticalRounded, BiMessageAltX } from 'react-icons/bi'

export default function DeleteMsgMenu({ message }: { message: Message }) {
  const menuBg = useColorModeValue('#fafafa', '#262626')

  async function handleDeleteMessage() {
    try {
      await message.remove()
    } catch (err) {
      console.error('Failed to delete message ->', err)
    }
  }

  return (
    <Box position="relative">
      <Menu isLazy>
        <MenuButton
          size="xs"
          as={IconButton}
          bg="transparent"
          icon={<BiDotsVerticalRounded />}
        />
        <MenuList px={2} shadow="xl" bg={menuBg} minW={140}>
          <MenuItem
            rounded="md"
            fontSize="xs"
            icon={<BiMessageAltX size={16} color="#ff6961" />}
            onClick={() => handleDeleteMessage()}
          >
            <Text color="#ff6961">Delete message</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
