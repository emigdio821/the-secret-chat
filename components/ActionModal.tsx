import {
  Modal,
  Stack,
  Input,
  Button,
  Spinner,
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
import { ModalCallbackProps } from 'types/index'
import AlertError from './AlertError'

interface ActionModalProps {
  btnLabel: string
  headerTitle: string
  inputLabel?: string
  BtnIcon?: React.ElementType
  action: ({ inputVal, onClose, setInputVal }: ModalCallbackProps) => void
}

interface OnChangeType {
  target: { value: SetStateAction<string> }
}

export default function ActionModal({
  action,
  BtnIcon,
  btnLabel,
  headerTitle,
  inputLabel = 'Room name',
}: ActionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, error, isLoading } = useGlobalContext()
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
    action({ inputVal, onClose, setInputVal })
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
                  size="sm"
                  type="submit"
                  disabled={!inputVal}
                  rightIcon={
                    !isLoading ? (
                      <BiRightArrowAlt size={16} />
                    ) : (
                      <Spinner
                        size="sm"
                        speed="0.6s"
                        color="#B2ABCC"
                        thickness="4px"
                      />
                    )
                  }
                >
                  {!isLoading ? btnLabel : <BiGhost size={22} />}
                </Button>
                <Button
                  size="sm"
                  colorScheme="gray"
                  onClick={() => handleCloseModal()}
                >
                  Close
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button
        mr={2}
        size="sm"
        onClick={() => handleOpenModal()}
        leftIcon={BtnIcon ? <BtnIcon size={22} /> : undefined}
      >
        {headerTitle}
      </Button>
    </>
  )
}
