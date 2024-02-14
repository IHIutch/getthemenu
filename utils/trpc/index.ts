import { Context } from '@/server/context'
import { initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})

export const router = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory