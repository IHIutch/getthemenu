import { initTRPC, TRPCError } from '@trpc/server'

import getSupabaseServerClient  from '../supabase/server'
import SuperJSON from 'superjson'

export async function createContext() {
  const supabaseClient = getSupabaseServerClient()

  const { data } = await supabaseClient.auth.getUser()

  return {
    user: data.user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON
})

export const router = t.router
export const publicProcedure = t.procedure
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  console.log({ ctx })

  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})
