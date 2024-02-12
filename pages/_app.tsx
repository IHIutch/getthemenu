import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import customTheme from '@/customTheme'
import { useEffect, useState } from 'react'
import { Router, useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { AppProps } from 'next/app'
import Error from 'next/error'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'


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

interface WorkaroundAppProps extends AppProps<{
  initialSession: Session
  dehydratedState?: DehydratedState
}> {
  err?: Error;
}

export default function App({ Component, pageProps, err }: WorkaroundAppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Fathom.load('DVZFRWML')
    }
  }, [router.events])

  const getLayout = Component.getLayout || ((page) => page)
  const [supabaseClient] = useState(() => createPagesBrowserClient())


  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <Hydrate state={pageProps.dehydratedState}>
          <ChakraProvider theme={theme}>
            {/* Workaround for https://github.com/vercel/next.js/issues/8592 */}
            {getLayout(<Component {...pageProps} err={err} />)}
          </ChakraProvider>
        </Hydrate>
      </SessionContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
