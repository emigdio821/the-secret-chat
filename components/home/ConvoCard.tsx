import {
  Box,
  Text,
  Stack,
  Badge,
  Heading,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import CommonBtn from 'components/CommonBtn'
import MotionDiv from 'components/MotionDiv'
import { BiRightArrowAlt } from 'react-icons/bi'
import { Conversation } from '@twilio/conversations'

interface ConvoCardProps {
  convo: Conversation
  isLoading: boolean
  btnCallback: (uniqueName: string) => void
}

export default function ConvoCard({
  convo,
  isLoading,
  btnCallback,
}: ConvoCardProps) {
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const { friendlyName, uniqueName, attributes } = convo
  // @ts-ignore
  const { description } = attributes
  const [unreadMessages, setUnreadMessages] = useState<Number>(0)

  const getUnreadMessages = useCallback(async () => {
    if (convo) {
      try {
        const unreadCount = await convo.getUnreadMessagesCount()
        setUnreadMessages(unreadCount || 0)
      } catch (err) {
        console.error('Failed to get unread messages ->', err)
      }
    }
  }, [convo])

  useEffect(() => {
    getUnreadMessages()
  }, [convo, getUnreadMessages, isLoading])

  return (
    <MotionDiv>
      <GridItem>
        <Box p={6} bg={bg} rounded="lg">
          <Stack spacing={6}>
            <Stack spacing={1}>
              <Stack direction="row" align="center">
                <Heading as="h5" size="sm" noOfLines={1}>
                  {friendlyName}
                </Heading>
                {unreadMessages > 0 && (
                  <Badge colorScheme="purple">
                    {unreadMessages.toString()}
                  </Badge>
                )}
              </Stack>
              <Text fontSize="sm" opacity={0.8}>
                {description || 'No chat description'}
              </Text>
            </Stack>
            <CommonBtn
              btnLabel="Join"
              isDisabled={isLoading}
              rightIcon={<BiRightArrowAlt />}
              onClick={() => btnCallback(uniqueName as string)}
            />
          </Stack>
        </Box>
      </GridItem>
    </MotionDiv>
  )
}
