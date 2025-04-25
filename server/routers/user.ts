import { prismaCreateUser, prismaGetUser } from '@/utils/prisma/users'
import { createStripeCustomer } from '@/utils/stripe'
import { authedProcedure, publicProcedure, router } from '@/utils/trpc'
import { UserSchema } from '@/utils/zod'
import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'

export const userRouter = router({
  setUpNewAccount: authedProcedure.input(
    z.object({
      payload: UserSchema.pick({
        fullName: true,
        id: true,
      }).extend({
        email: z.string().email(),
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input

    // const supabase = ctx.supabase
    // const supaUser = await supabase?.auth.getUser()

    const stripeCustomer = await createStripeCustomer({
      email: payload.email,
      name: payload.fullName || '',
    })

    await prismaCreateUser({
      payload: {
        id: payload.id,
        fullName: payload.fullName,
        stripeCustomerId: stripeCustomer.id,
        trialEndsAt: dayjs().add(30, 'day').endOf('day').toISOString(),
      },
    })
  }),
  getAuthedUser: publicProcedure.query(async ({ ctx }) => {
    const authedUser = ctx.session.user

    if (authedUser) {
      const data = await prismaGetUser({ where: { id: authedUser.id } })
      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `getAuthedUser error: No user found with id '${authedUser.id}'`,
        })
      }

      return {
        ...data,
        email: authedUser.email,
      }
    }
    return null
  }),
})
