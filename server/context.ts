import type { User } from '@supabase/supabase-js'
import type * as trpcNext from '@trpc/server/adapters/next'

import { createClientApi } from '@/utils/supabase/api'

interface CreateInnerContextOptions extends Partial<trpcNext.CreateNextContextOptions> {
  session: {
    user: User | null
  }
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(opts: CreateInnerContextOptions) {
  return {
    ...opts,
  }
}

export type Context = Awaited<ReturnType<typeof createContextInner>>

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/v11/caching

  const supabase = createClientApi(opts.req, opts.res)

  // Always use getUser() on the server: https://github.com/orgs/supabase/discussions/4400#discussioncomment-7944647
  const { data } = await supabase.auth.getUser()

  const contextInner = await createContextInner({
    session: {
      user: data.user,
    },
  })
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  }
}
