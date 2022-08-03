import { extendTheme, type ThemeConfig, Spinner } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode('#f5f5f5', '#333')(props),
    },
  }),
}

const shadows = {
  outline: '0 0 0 3px #B2ABCC',
}

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const components = {
  Alert: {
    variants: {
      minimal: {
        container: {
          color: '#fafafa',
          bg: '#242424',
        },
      },
    },
  },
}

Spinner.defaultProps = {
  ...Spinner.defaultProps,
  size: 'sm',
  speed: '0.6s',
  thickness: '4px',
  color: '#B2ABCC',
}

const theme = extendTheme({ config, styles, shadows, components })
export default theme
