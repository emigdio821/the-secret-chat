import { useColorModeValue } from '@chakra-ui/react'

export default function useBgGradient() {
  const mainGradient = useColorModeValue(
    'rgba(237, 237, 237, 0.2)',
    'rgba(39, 39, 39, 0.4)',
  )
  const secondGradient = useColorModeValue(
    'rgba(237, 237, 237, 1)',
    'rgba(39, 39, 39, 1)',
  )
  const bg = `linear-gradient(180deg, ${mainGradient}, ${secondGradient} 85%),radial-gradient(ellipse at top left, rgba(13, 110, 253, 0.2), transparent 50%),radial-gradient(ellipse at top right, rgba(255, 228, 132, 0.2), transparent 50%),radial-gradient(ellipse at center right, rgba(112, 44, 249, 0.2), transparent 50%),radial-gradient(ellipse at center left, rgba(214, 51, 132, 0.2), transparent 50%)`

  return bg
}
