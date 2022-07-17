import { Button, useColorModeValue } from '@chakra-ui/react'

interface CommonBtnProps {
  isDisabled?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  btnLabel: string | React.ReactNode
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | undefined
}

export default function CommonBtn({
  onClick,
  btnLabel,
  size = 'md',
  shadow = 'sm',
  type = 'button',
  isDisabled = false,
  leftIcon = undefined,
  rightIcon = undefined,
}: CommonBtnProps) {
  const btnBg = useColorModeValue('#444', '#262626')
  const btnHover = useColorModeValue('#333', '#222')
  const btnColor = useColorModeValue('#fafafa', '#fafafa')

  return (
    <Button
      bg={btnBg}
      size={size}
      type={type}
      shadow={shadow}
      color={btnColor}
      onClick={onClick}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      disabled={isDisabled}
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
