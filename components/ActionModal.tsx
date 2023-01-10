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
  useColorModeValue,
} from '@chakra-ui/react'
import useStore from 'store/global'
import { SetStateAction, useState } from 'react'
import { BiGhost, BiRightArrowAlt } from 'react-icons/bi'
import { ModalCallbackProps } from 'types'
import AlertError from './AlertError'

interface ActionModalProps {
  isOpen: boolean
  btnLabel: string
  onOpen: () => void
  onClose: () => void
  headerTitle: string
  inputLabel?: string
  additionalInput?: boolean
  additionalInputLabel?: string
  action: ({ inputVal, closeModal }: ModalCallbackProps) => void
}

interface OnChangeType {
  target: { value: SetStateAction<string> }
}

export default function ActionModal({
  action,
  btnLabel,
  isOpen,
  onClose,
  headerTitle,
  additionalInput = false,
  inputLabel = 'Room name',
  additionalInputLabel = 'Description',
}: ActionModalProps) {
  const [inputVal, setInputVal] = useState<string>('')
  const { error, isLoading, removeError } = useStore()
  const [additionalInputVal, setAdditionalInputVal] = useState<string>('')

  function isBtnDisabled() {
    const inputCondition = !inputVal || !inputVal.trim() || isLoading
    if (additionalInput) {
      return inputCondition || !additionalInputVal || !additionalInputVal.trim()
    }
    return inputCondition
  }

  function handleCloseModal() {
    if (inputVal || additionalInputVal) {
      setInputVal('')
      setAdditionalInputVal('')
    }

    if (error) removeError()
    onClose()
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (additionalInput) {
      action({ inputVal, additionalInputVal, closeModal: handleCloseModal })
    } else {
      action({ inputVal, closeModal: handleCloseModal })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      onClose={() => handleCloseModal()}
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
                maxLength={30}
                value={inputVal}
                disabled={isLoading}
                placeholder={inputLabel}
                focusBorderColor="#B2ABCC"
                onChange={(e: OnChangeType) => setInputVal(e.target.value)}
              />
              {additionalInput && (
                <Input
                  mb={4}
                  size="md"
                  maxLength={50}
                  disabled={isLoading}
                  value={additionalInputVal}
                  focusBorderColor="#B2ABCC"
                  placeholder={additionalInputLabel}
                  onChange={(e: OnChangeType) =>
                    setAdditionalInputVal(e.target.value)
                  }
                />
              )}
              {error && <AlertError error={error} />}
            </FormControl>
            <Stack direction="row-reverse" mb={2} mt={4}>
              <Button
                type="submit"
                disabled={isBtnDisabled()}
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
  )
}
