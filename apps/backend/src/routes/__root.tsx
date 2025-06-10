import type { QueryClient } from '@tanstack/react-query'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'

import type { AppRouter } from '~/utils/trpc/routes'

import { NotFound } from '~/components/not-found'

import { DefaultCatchBoundary } from '../components/default-catch-boundary'

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

const theme = createSystem(defaultConfig, defineConfig({
  globalCss: {
    'html, body, #__next': {
      bg: 'gray.50',
      height: '100%',
    },
  },
}))

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={theme}>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="p-2 flex gap-2 text-lg">
            {/* <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{' '}
            <Link
              to="/$publicId/dashboard"
              activeProps={{
                className: 'font-bold',
              }}
            >
              Dashboard
            </Link> */}

          </div>
          <hr />
          {children}
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools buttonPosition="bottom-right" />
          <Scripts />
        </body>
      </html>
    </ChakraProvider>
  )
}
