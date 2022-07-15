import {
  Modal,
  Stack,
  Input,
  Button,
  ModalBody,
  ModalHeader,
  FormControl,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import { SetStateAction, useState } from 'react'
import { BiGhost, BiRightArrowAlt } from 'react-icons/bi'
import { useGlobalContext } from 'context/global'
import actions from 'context/globalActions'
import { ModalCallbackProps } from 'types'
import AlertError from './AlertError'
import Spinner from './Spinner'

interface ActionModalProps {
  btnLabel: string
  headerTitle: string
  inputLabel?: string
  mainBtnLbl?: string
  BtnIcon?: React.ElementType
  action: ({ inputVal, onClose }: ModalCallbackProps) => void
}

interface OnChangeType {
  target: { value: SetStateAction<string> }
}

export default function ActionModal({
  action,
  BtnIcon,
  btnLabel,
  headerTitle,
  mainBtnLbl = headerTitle,
  inputLabel = 'Room name',
}: ActionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, error, isLoading, client } = useGlobalContext()
  const [inputVal, setInputVal] = useState<string>('')

  function handleOpenModal() {
    setInputVal('')
    if (error) {
      dispatch({
        type: actions.removeError,
      })
    }
    onOpen()
  }

  function handleCloseModal() {
    setInputVal('')
    if (error) {
      dispatch({
        type: actions.removeError,
      })
    }
    onClose()
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    action({ inputVal, onClose })
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => handleCloseModal()}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={useColorModeValue('#fafafa', '#333')}>
          <ModalHeader>{headerTitle}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <FormControl isRequired>
                <Input
                  mb={4}
                  size="md"
                  value={inputVal}
                  disabled={isLoading}
                  placeholder={inputLabel}
                  focusBorderColor="#B2ABCC"
                  onChange={(e: OnChangeType) => setInputVal(e.target.value)}
                />
                {error && <AlertError error={error} />}
              </FormControl>
              <Stack direction="row-reverse" mb={2} mt={4}>
                <Button
                  type="submit"
                  disabled={!inputVal || !inputVal.trim() || isLoading}
                  rightIcon={!isLoading ? <BiRightArrowAlt /> : <Spinner />}
                >
                  {!isLoading ? btnLabel : <BiGhost size={18} />}
                </Button>
                <Button colorScheme="gray" onClick={() => handleCloseModal()}>
                  Close
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button
        color="#fafafa"
        disabled={!client}
        bg={useColorModeValue('#333', '#262626')}
        _hover={{
          bg: '#444',
        }}
        _active={{
          bg: '#262626',
        }}
        onClick={() => handleOpenModal()}
        leftIcon={BtnIcon ? <BtnIcon /> : undefined}
      >
        {mainBtnLbl}
      </Button>
    </>
  )
}
