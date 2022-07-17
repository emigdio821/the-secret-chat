import {
  Text,
  Popover,
  IconButton,
  PopoverBody,
  PopoverArrow,
  PopoverHeader,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  PopoverCloseButton,
} from '@chakra-ui/react'
import { IoMdInformation } from 'react-icons/io'

export default function ProfilePopInfo() {
  const bg = useColorModeValue('#fafafa', '#262626')

  return (
    <Popover isLazy autoFocus={false}>
      <PopoverTrigger>
        <IconButton
          size="xs"
          shadow="xl"
          rounded="full"
          aria-label="Info"
          colorScheme="blue"
          icon={<IoMdInformation size={20} />}
        />
      </PopoverTrigger>
      <PopoverContent bg={bg} shadow="xl" maxW={280}>
        <PopoverArrow bg={bg} />
        <PopoverCloseButton />
        <PopoverHeader fontWeight={600}>Info</PopoverHeader>
        <PopoverBody>
          <Text fontSize="sm">
            This picture is from your Github account. It will get synced
            automatically.
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
