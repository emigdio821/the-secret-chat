import {
  MenuItemProps,
  useColorModeValue,
  MenuItem as ChakraMenuItem,
} from '@chakra-ui/react'

export default function MenuItem({
  as,
  icon,
  onClick,
  children,
  fontSize,
}: MenuItemProps) {
  const bg = useColorModeValue('#fafafa', '#262626')
  const bgHover = useColorModeValue('gray.100', 'whiteAlpha.100')

  return (
    <ChakraMenuItem
      as={as}
      rounded="md"
      _hover={{
        bg: bgHover,
      }}
      bg={bg}
      icon={icon}
      onClick={onClick}
      fontSize={fontSize}
    >
      {children}
    </ChakraMenuItem>
  )
}
