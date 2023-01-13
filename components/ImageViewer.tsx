import {
  Image,
  Modal,
  Stack,
  Center,
  Spinner,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface ImageViewerProps {
  url: string
  name?: string | null
}

export default function ImageViewer({ url, name }: ImageViewerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="transparent" shadow="none">
          <ModalHeader>{name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                initial={{ opacity: 0, y: 20 }}
              >
                <Image
                  w="100%"
                  alt="gif"
                  src={url}
                  maxH="100%"
                  shadow="xl"
                  rounded="lg"
                  objectFit="contain"
                  fallback={
                    <Center w="100%" h={130} rounded="lg" bg="#242424">
                      <Spinner />
                    </Center>
                  }
                />
              </motion.div>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Image
        h={130}
        w="100%"
        alt="gif"
        src={url}
        rounded="lg"
        cursor="pointer"
        objectFit="contain"
        onClick={() => onOpen()}
        fallback={
          <Center w={120} h={130} rounded="lg" bg="#242424">
            <Spinner />
          </Center>
        }
      />
    </>
  )
}
