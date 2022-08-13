import {
  Box,
  Menu,
  Text,
  useToast,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuButton,
  IconButton,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  BiTrash,
  BiImage,
  BiRocket,
  BiImages,
  BiPaperclip,
  BiMicrophone,
} from 'react-icons/bi'
import { useState, useEffect, useCallback, ReactElement } from 'react'
import { useGlobalContext } from 'context/global'
import styles from 'styles/common.module.css'
import MotionDiv from 'components/MotionDiv'
import { secsToTime } from 'utils'
import GifPicker from './GifPicker'

export default function Media() {
  const toast = useToast()
  const { conversation } = useGlobalContext()
  const bg = useColorModeValue('#fafafa', '#262626')
  const btnHover = useColorModeValue('#fff', '#222')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnBg = useColorModeValue('#fafafa', '#262626')
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([])
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioStream, setAudioStream] = useState<MediaStream>()
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder>()

  function processingToast(
    title?: string,
    description?: string,
    icon?: ReactElement,
  ) {
    return toast({
      icon,
      description,
      duration: null,
      position: 'top',
      status: 'loading',
      variant: 'minimal',
      title: title || 'Processing...',
    })
  }

  function errorToast(title?: string, description?: string) {
    return toast({
      description,
      status: 'error',
      position: 'top',
      isClosable: true,
      title: title || 'Error',
    })
  }

  function handleUploadImage() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    fileInput.click()
  }

  const handleStopRecorder = useCallback(() => {
    if (audioRecorder && audioStream && audioStream.active) {
      toast.closeAll()
      audioRecorder.stop()
      audioStream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }, [audioRecorder, audioStream, toast])

  async function handleStopRecording() {
    if (audioRecorder) {
      handleStopRecorder()
      setIsRecording(false)
      const audioToast = processingToast('Processing audio...')
      const audioBlob = new Blob(audioBlobs, {
        type: 'audio/wav',
      })
      const formData = new FormData()
      formData.append('file', audioBlob as Blob, 'audio.wav')
      await conversation.sendMessage(formData)
      setAudioBlobs([])
      toast.close(audioToast)
    }
  }

  async function handleAudioRecord() {
    if (isRecording) return
    const { mediaDevices } = navigator

    if (!mediaDevices) {
      errorToast('No audio input', 'Check your browser settings')
    } else {
      try {
        const stream = await mediaDevices.getUserMedia({ audio: true })
        const recordAudio = new Audio('/sounds/record_sound.mp3')
        if (recordAudio.paused) recordAudio.play()
        const recorder = new MediaRecorder(stream)
        recordAudio.onended = () => {
          setIsRecording(true)
          processingToast(
            'Recording audio...',
            undefined,
            <BiMicrophone
              size={24}
              color="#ff6961"
              className={styles['recording-animation']}
            />,
          )
          setAudioRecorder(recorder)
          setAudioStream(stream)
          recorder.start(1000)
          recorder.ondataavailable = (e) => {
            if (recorder.state === 'inactive') {
              setAudioBlobs([])
            } else {
              setAudioBlobs((prevBlobs) => [...prevBlobs, e.data])
            }
          }
        }
      } catch {
        errorToast(
          'Permission denied',
          'Check your mic permission and try again',
        )
        setIsRecording(false)
      }
    }
  }

  async function handleUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const file = e.target.files?.[0]
    const formData = new FormData()
    const ext = file?.name.split('.').pop()
    const validExt = ['jpg', 'jpeg', 'png', 'gif']
    if (file && validExt.includes(ext as string)) {
      const fileToast = processingToast('Processing image...')
      formData.append('file', file)
      await conversation.sendMessage(formData)
      toast.close(fileToast)
      e.target.value = ''
    } else {
      errorToast(
        'Invalid file type',
        'Only jpg, jpeg, png, and gif are supported',
      )
    }
  }

  useEffect(
    () => () => {
      handleStopRecorder()
    },
    [handleStopRecorder],
  )

  return (
    <Box>
      <GifPicker isOpen={isOpen} onClose={onClose} />
      <Menu isOpen={isRecording || undefined}>
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
              {isRecording ? (
                <MotionDiv>
                  <MenuGroup title={secsToTime(audioBlobs.length)}>
                    <MenuItem
                      rounded="md"
                      icon={<BiRocket size={16} />}
                      onClick={() => handleStopRecording()}
                    >
                      Send audio
                    </MenuItem>
                    <MenuItem
                      rounded="md"
                      onClick={() => handleStopRecorder()}
                      icon={<BiTrash size={16} color="#ff6961" />}
                    >
                      <Text color="#ff6961">Cancel recording</Text>
                    </MenuItem>
                  </MenuGroup>
                </MotionDiv>
              ) : (
                <>
                  <MenuItem
                    rounded="md"
                    onClick={onOpen}
                    icon={<BiImages size={16} />}
                  >
                    GIF
                  </MenuItem>
                  <MenuItem
                    rounded="md"
                    icon={<BiImage size={16} />}
                    onClick={() => handleUploadImage()}
                  >
                    Upload image
                  </MenuItem>
                  <MenuItem
                    rounded="md"
                    icon={<BiMicrophone size={16} />}
                    onClick={() => handleAudioRecord()}
                  >
                    Record audio
                  </MenuItem>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleUploadImg(e)}
                  />
                </>
              )}
            </MenuList>
          </Box>
        )}
      </Menu>
    </Box>
  )
}
