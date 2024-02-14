import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import customTheme from '@/customTheme'
import * as React from 'react'
import { Router } from 'next/router'
import * as Fathom from 'fathom-client'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc/client'
import { NextPage } from 'next'


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
  })
)

Router.events.on('routeChangeComplete', (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps, }: AppPropsWithLayout) => {
  // Delete this when moving to app router
  const getLayout =
    Component.getLayout ?? ((page) => { page });

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

export default trpc.withTRPC(App);