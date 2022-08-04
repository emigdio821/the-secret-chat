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
import { useState } from 'react'
import { useGlobalContext } from 'context/global'
import {
  BiStop,
  BiImage,
  BiImages,
  BiMicrophone,
  BiPaperclip,
} from 'react-icons/bi'
import GifPicker from './GifPicker'

export default function Media() {
  const toast = useToast()
  const bg = useColorModeValue('#fafafa', '#262626')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')
  const { conversation } = useGlobalContext()

  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder>()
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([])
  const [audioStream, setAudioStream] = useState<MediaStream>()

  function handleUploadImage() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    fileInput.click()
  }

  async function handleStopRecording() {
    if (audioRecorder) {
      audioRecorder.stop()
      audioStream?.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      const audioBlob = new Blob(audioBlobs, {
        type: 'audio/wav',
      })
      const formData = new FormData()
      formData.append('file', audioBlob as Blob, 'audio.wav')
      await conversation.sendMessage(formData)
      setAudioBlobs([])
    }
  }

  function handleAudioRecord() {
    if (isRecording) return
    setIsRecording(true)
    const { mediaDevices } = navigator
    mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream)
      setAudioRecorder(recorder)
      setAudioStream(stream)
      recorder.start(1000)
      recorder.ondataavailable = (e) => {
        setAudioBlobs((prevBlobs) => [...prevBlobs, e.data])
      }
    })
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
        {({ isOpen: isMenuOpen }) => (
          <Box>
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
              bg={bg}
              minW={140}
              fontSize="sm"
              display={!isMenuOpen ? 'none' : undefined}
            >
              <MenuItem
                rounded="md"
                onClick={onOpen}
                icon={<BiImages size={16} />}
              >
                GIF
              </MenuItem>

              {isRecording ? (
                <MenuItem
                  rounded="md"
                  icon={<BiStop size={16} />}
                  onClick={() => handleStopRecording()}
                >
                  Stop recording
                </MenuItem>
              ) : (
                <MenuItem
                  rounded="md"
                  icon={<BiMicrophone size={16} />}
                  onClick={() => handleAudioRecord()}
                >
                  Record audio
                </MenuItem>
              )}
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
            </MenuList>
          </Box>
        )}
      </Menu>
    </Box>
  )
}
