/* eslint-disable react/jsx-props-no-spreading */
import theme from 'lib/theme'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { GlobalProvider } from 'context/global'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <SessionProvider session={pageProps.session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </GlobalProvider>
  )
}
