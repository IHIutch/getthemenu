import { Context } from '@/server/context'
import { TRPCError, initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})

export const router = t.router
export const publicProcedure = t.procedure
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const createCallerFactory = t.createCallerFactory
