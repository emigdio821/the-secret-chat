import { Button, useColorModeValue, type ButtonProps } from '@chakra-ui/react'

interface CommonBtnProps extends ButtonProps {
  btnLabel: string | React.ReactNode
}

export default function CommonBtn({ btnLabel, ...props }: CommonBtnProps) {
  const btnBg = useColorModeValue('#444', '#262626')
  const btnHover = useColorModeValue('#333', '#222')

  return (
    <Button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      bg={btnBg}
      _hover={{
        bg: btnHover,
      }}
      _active={{
        bg: btnBg,
      }}
    >
      {btnLabel}
    </Button>
  )
}
