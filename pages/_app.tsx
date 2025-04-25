import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import process from 'node:process'
import customTheme from '@/customTheme'
import { trpc } from '@/utils/trpc/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as Fathom from 'fathom-client'
import { Router } from 'next/router'
import * as React from 'react'

const theme = extendTheme(
  customTheme,
  withProse({
    baseStyle: {
      a: {
        textDecoration: 'underline',
        fontWeight: 'semibold',
      },
      h5: {
        fontWeight: 'semibold',
        fontSize: 'md',
        marginTop: '6',
      },
    },
  }),
)

Router.events.on('routeChangeComplete', (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview()
  }
})

export type NextPageWithLayout<P = Record<string, any>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  // Delete this when moving to app router
  const getLayout
    = Component.getLayout ?? (page => page)

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Fathom.load('DVZFRWML')
    }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
      <ReactQueryDevtools initialIsOpen={false} />
    </ChakraProvider>
  )
}

export default trpc.withTRPC(App)
