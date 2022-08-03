import {
  Box,
  Menu,
  useToast,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { BiImage, BiImages, BiMicrophone, BiPaperclip } from 'react-icons/bi'
import GifPicker from './GifPicker'

export default function Media() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')
  const { conversation } = useGlobalContext()

  function handleUploadImage() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    fileInput.click()
  }

  async function handleUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const file = e.target.files?.[0]
    const formData = new FormData()
    const ext = file?.name.split('.').pop()
    const validExt = ['jpg', 'jpeg', 'png', 'gif']
    if (file && validExt.includes(ext as string)) {
      const fileToast = toast({
        duration: null,
        position: 'top',
        status: 'loading',
        variant: 'minimal',
        title: 'Uploading image...',
      })
      formData.append('file', file)
      await conversation.sendMessage(formData)
      toast.close(fileToast)
      e.target.value = ''
    } else {
      toast({
        status: 'error',
        position: 'top',
        isClosable: true,
        title: 'Invalid file type',
        description: 'Only jpg, jpeg, png, and gif are supported',
      })
    }
  }

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
            rounded="md"
            icon={<BiImage size={16} />}
            onClick={() => handleUploadImage()}
          >
            Upload image
          </MenuItem>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleUploadImg(e)}
          />
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
