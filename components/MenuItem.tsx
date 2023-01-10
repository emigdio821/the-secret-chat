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
  const bgHover = useColorModeValue('#f5f5f5', '#222')

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
