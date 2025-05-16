import type { AppRouter } from '@/server'

import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { ssrPrepass } from '@trpc/next/ssrPrepass'
import SuperJSON from 'superjson'

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  transformer: SuperJSON,
  config({ ctx }) {
    return {
      links: [
        // loggerLink({
        //   enabled: opts =>
        //     (process.env.NODE_ENV === 'development'
        //       && typeof window !== 'undefined')
        //     || (opts.direction === 'down' && opts.result instanceof Error),
        // }),
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/v11/ssr
           */
          url: `${getBaseUrl()}/api/trpc`,
          /**
           * @link https://trpc.io/docs/v11/data-transformers
           */
          transformer: SuperJSON,
          // You can pass any HTTP headers you wish here
          headers() {
            if (!ctx?.req?.headers) {
              return {}
            }
            // To use SSR properly, you need to forward client headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            return {
              cookie: ctx.req.headers.cookie,
            }
          },
        }),
      ],
    }
  },
  /**
   * @link https://trpc.io/docs/v11/ssr
   */
  ssr: true,
  ssrPrepass,
})
