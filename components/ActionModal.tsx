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
  Spinner,
} from '@chakra-ui/react'
import { SetStateAction, useState } from 'react'
import { BiGhost, BiRightArrowAlt } from 'react-icons/bi'
import { useGlobalContext } from 'context/global'
import actions from 'context/globalActions'
import { ModalCallbackProps } from 'types/index'
import { motion } from 'framer-motion'

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
  const { dispatch, error, isLoading } = useGlobalContext()
  const [inputVal, setInputVal] = useState<string>('')

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
                  disabled={isLoading}
                  placeholder="Room name"
                  focusBorderColor="#B2ABCC"
                  onChange={(e: OnChangeType) => setInputVal(e.target.value)}
                />
                {error && (
                  <motion.div
                    key={error}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: -10 }}
                  >
                    <Text color="#ff6961" fontSize="xs" pt={2}>
                      {error}
                    </Text>
                  </motion.div>
                )}
              </FormControl>
              <Stack direction="row-reverse" my={4}>
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
        onClick={onOpen}
        leftIcon={BtnIcon ? <BtnIcon size={22} /> : undefined}
      >
        {headerTitle}
      </Button>
    </>
  )
}
