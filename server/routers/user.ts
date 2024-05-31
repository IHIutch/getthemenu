import { prismaCreateUser, prismaGetUser } from "@/utils/prisma/users";
import { authedProcedure, router } from "@/utils/trpc";
import { UserSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { createStripeCustomer } from '@/utils/stripe'
import { z } from "zod";
import dayjs from "dayjs";

export const userRouter = router({
  setUpNewAccount: authedProcedure.input(
    z.object({
      payload: UserSchema.pick({
        fullName: true,
        id: true,
      }).extend({
        email: z.string().email()
      })
    })
  ).mutation(async ({ input, ctx }) => {
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
      }
    })
  }),
  getAuthedUser: authedProcedure.query(async ({ ctx }) => {
    const authedUser = ctx.session.user
    const data = await prismaGetUser({ where: { id: authedUser.id } })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `getAuthedUser error: No user found with id '${authedUser.id}'`,
      })
    }

    return {
      ...data,
      email: authedUser.email
    }
  })
})
