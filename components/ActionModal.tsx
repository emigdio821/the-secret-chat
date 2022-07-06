import {
  Text,
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
import { BiRightArrowAlt } from 'react-icons/bi'
import { useGlobalContext } from 'context/global'
import actions from 'context/globalActions'
import { ModalCallbackProps } from 'types/index'

interface ActionModalProps {
  btnLabel: string
  headerTitle: string
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
}: ActionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, error } = useGlobalContext()
  const [inputVal, setInputVal] = useState<string>('')

  function handleOpenModal() {
    if (error) {
      dispatch({
        type: actions.removeError,
      })
    }
    onOpen()
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    action({ inputVal, onClose, setInputVal })
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
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
                  size="md"
                  value={inputVal}
                  placeholder="Room name"
                  onChange={(e: OnChangeType) => setInputVal(e.target.value)}
                />
                {error && (
                  <Text color="#ff6961" fontSize="sm" pt={2}>
                    {error}
                  </Text>
                )}
              </FormControl>
              <Stack direction="row-reverse" my={4}>
                <Button
                  size="sm"
                  type="submit"
                  disabled={!inputVal}
                  rightIcon={<BiRightArrowAlt size={16} />}
                >
                  {btnLabel}
                </Button>
                <Button size="sm" colorScheme="gray" onClick={onClose}>
                  Close
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button
        mr={2}
        onClick={() => handleOpenModal()}
        leftIcon={BtnIcon ? <BtnIcon size={22} /> : undefined}
      >
        {headerTitle}
      </Button>
    </>
  )
}
