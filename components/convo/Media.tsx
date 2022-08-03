import {
  Box,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import { BiImage, BiImages, BiMicrophone, BiPaperclip } from 'react-icons/bi'
import GifPicker from './GifPicker'

export default function Media() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')

  return (
    <Box>
      <GifPicker isOpen={isOpen} onClose={onClose} />
      <Menu>
        <MenuButton
          bg={btnBg}
          shadow="sm"
          as={IconButton}
          _hover={{
            bg: btnHover,
          }}
          _active={{
            bg: btnHover,
          }}
          size="sm"
          icon={<BiPaperclip />}
        />
        <MenuList
          px={2}
          minW={140}
          fontSize="sm"
          bg={useColorModeValue('#fafafa', '#262626')}
        >
          <MenuItem rounded="md" icon={<BiImages size={16} />} onClick={onOpen}>
            GIF
          </MenuItem>
          <MenuItem
            isDisabled
            rounded="md"
            icon={<BiImage size={16} />}
            // onClick={() => handleOpenModal()}
          >
            Upload photo
          </MenuItem>
          <MenuItem
            isDisabled
            rounded="md"
            icon={<BiMicrophone size={16} />}
            // onClick={() => handleOpenModal()}
          >
            Voice message
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
