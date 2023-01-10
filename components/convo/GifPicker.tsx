import {
  Box,
  Grid,
  Modal,
  Stack,
  Input,
  Image,
  Button,
  Center,
  Spinner,
  GridItem,
  ModalBody,
  IconButton,
  FormControl,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react'
import useStore from 'store/global'
import useGiphy from 'hooks/useGiphy'
import { BiSearch } from 'react-icons/bi'
import type { IGif } from '@giphy/js-types'
import { useGlobalContext } from 'context/global'
import { useRef, useState, useEffect, useCallback } from 'react'

interface GifPickerProps {
  isOpen: boolean
  onClose: () => void
}

export default function GifPicker({ isOpen, onClose }: GifPickerProps) {
  const gf = useGiphy()
  const btnRef = useRef(null)
  const [gifs, setGifs] = useState<IGif[]>([])
  const { addLoading, removeLoading, isLoading } = useStore()
  const { conversation } = useGlobalContext()
  const [inputVal, setInputVal] = useState('')

  const fetchInitialGifs = useCallback(
    async (offset: number) => {
      const res = await gf.trending({ offset, limit: 50 })
      setGifs(res.data)
    },
    [gf],
  )

  async function handleSearchGifs(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLoading()
    try {
      const res = await gf.search(inputVal, { limit: 50 })
      setGifs(res.data)
    } catch (err) {
      setGifs([])
      console.error(err)
    } finally {
      removeLoading()
    }
  }

  function handleGifClick(gif: IGif) {
    conversation.sendMessage(gif.images.original.url, {
      gif: true,
    })
    onClose()
  }

  useEffect(() => {
    if (inputVal === '') fetchInitialGifs(0)
  }, [fetchInitialGifs, inputVal])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={btnRef}
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={useColorModeValue('#fafafa', '#333')}>
        <ModalHeader>Pick a GIF</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={6}>
            <form onSubmit={handleSearchGifs}>
              <Stack direction="row">
                <FormControl isRequired>
                  <Input
                    value={inputVal}
                    focusBorderColor="#B2ABCC"
                    placeholder="Search for a GIF"
                    bg={useColorModeValue('#fafafa', '#272727')}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                </FormControl>
                <IconButton
                  type="submit"
                  aria-label="Send"
                  icon={<BiSearch />}
                  colorScheme="purple"
                  disabled={!inputVal.trim() || isLoading}
                />
              </Stack>
            </form>
          </Box>
          {isLoading ? (
            <Center bg="#242424" rounded="lg" p={6}>
              <Spinner />
            </Center>
          ) : (
            <Box>
              {gifs.length > 0 ? (
                <Grid
                  gap={4}
                  maxH={400}
                  rounded="md"
                  overflowY="auto"
                  templateColumns={{
                    md: 'repeat(3, 1fr)',
                    base: 'repeat(2, 1fr)',
                  }}
                >
                  {gifs.map((gif: IGif) => (
                    <GridItem
                      key={gif.id}
                      cursor="pointer"
                      onClick={() => handleGifClick(gif)}
                    >
                      <Image
                        h={130}
                        w="100%"
                        alt="gif"
                        rounded="lg"
                        src={gif.images.fixed_height.url}
                        fallback={
                          <Center w="100%" h={130} rounded="lg" bg="#242424">
                            <Spinner />
                          </Center>
                        }
                      />
                    </GridItem>
                  ))}
                </Grid>
              ) : (
                <Box>Oops, no gifs found</Box>
              )}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
