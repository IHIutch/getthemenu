import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

import getSupabaseApiClient from '@/utils/supabase/api'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

// interface CreateInnerContextOptions {
//   user?: User | null
// }

// export async function createContextInner(opts: CreateInnerContextOptions) {
//   return {
//     ...opts,
//   }
// }

export async function createContext(opts: CreateNextContextOptions) {
  const supabaseClient = getSupabaseApiClient(opts.req, opts.res)

  const { data } = await supabaseClient.auth.getUser()

  // const contextInner = await createContextInner({
  //   user: data.user,
  // })

  return {
    user: data.user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})
// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const createCallerFactory = t.createCallerFactory
