import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import customTheme from '@/customTheme'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import { withProse } from '@nikolovlazar/chakra-ui-prose'

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

export default function App({ Component, pageProps, err }) {
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
      Fathom.load('DVZFRWML', {
        url: 'https://xyz.getthemenu.io/script.js',
      })

      function onRouteChangeComplete() {
        Fathom.trackPageview()
      }
      // Record a pageview when route changes
      router.events.on('routeChangeComplete', onRouteChangeComplete)

      // Unassign event listener
      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    }
  }, [router.events])

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          {/* Workaround for https://github.com/vercel/next.js/issues/8592 */}
          {getLayout(<Component {...pageProps} err={err} />)}
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
