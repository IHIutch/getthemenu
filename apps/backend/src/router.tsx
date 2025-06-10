import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import type { AppRouter } from './utils/trpc/routes'

import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient()
  const trpc = createTRPCOptionsProxy<AppRouter>({
    client: createTRPCClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }),
    queryClient,
  })

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      trpc,
      queryClient,
    },
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
