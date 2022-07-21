import { useSession } from 'next-auth/react'
import { Participant as Part } from '@twilio/conversations'
import { Avatar, Stack, Text } from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { useEffect, useState, useCallback } from 'react'
import { getAvatar } from 'utils'
import ParticipantMenu from './ParticipantMenu'

interface PartProps {
  admin: Part | undefined
  participant: Part
}

interface UserProps {
  p: string | null
}

function User({ p }: UserProps) {
  return (
    <Text fontWeight={600} fontSize="xs" noOfLines={1}>
      {p}
    </Text>
  )
}

export default function Participant({ participant, admin }: PartProps) {
  const { identity } = participant
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''
  const userImg = session?.user?.image || ''
  const isAuthor = identity === currentUser
  const { conversation } = participant
  const { client } = useGlobalContext()
  const [friendlyName, setFriendlyName] = useState<string>(identity || '')
  const [avatar, setAvatar] = useState<string>('')
  const isAdmin = admin?.identity === currentUser

  const getFriendlyName = useCallback(async () => {
    if (identity) {
      const user = await client.getUser(identity)
      const avatarUrl = getAvatar(user)
      if (user.friendlyName) setFriendlyName(user.friendlyName)
      if (avatarUrl) setAvatar(avatarUrl)
    }
  }, [client, identity])

  useEffect(() => {
    getFriendlyName()
  }, [getFriendlyName, identity])

  return (
    <Stack
      align="center"
      // py={{ base: 0, sm: 1 }}
      spacing={{ base: 1, sm: 2 }}
      direction={{ base: 'column', sm: 'row' }}
    >
      {currentUser !== identity ? (
        <ParticipantMenu
          avatar={avatar}
          userImg={userImg}
          isAdmin={isAdmin}
          identity={identity}
          isAuthor={isAuthor}
          participant={participant}
          friendlyName={friendlyName}
          conversation={conversation}
          adminId={admin?.identity || ''}
        />
      ) : (
        <>
          <Avatar
            h={4}
            w={4}
            size="xs"
            bg="gray.700"
            color="#fafafa"
            src={isAuthor ? userImg : avatar}
            name={friendlyName.charAt(0) || 'Unknown'}
          />
          <Stack maxW={20} rounded="md">
            <User p="You" />
          </Stack>
        </>
      )}
    </Stack>
  )
}
