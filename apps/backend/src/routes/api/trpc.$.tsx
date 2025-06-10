import { createServerFileRoute } from '@tanstack/react-start/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from 'src/utils/trpc/routes'

import { createContext } from '~/utils/trpc/server'

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  })
}

export const ServerRoute = createServerFileRoute('/api/trpc/$').methods({
  GET: ({ request }) => handler(request),
  POST: ({ request }) => handler(request),
})
