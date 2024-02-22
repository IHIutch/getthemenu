import { prismaCreateUser, prismaGetUser } from "@/utils/prisma/users";
import { publicProcedure, router } from "@/utils/trpc";
import { UserSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { createStripeCustomer } from '@/utils/stripe'
import { z } from "zod";
import dayjs from "dayjs";

export const userRouter = router({
  setUpNewAccount: publicProcedure.input(
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
  getAuthedUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.supabase) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `supabase not passed to ctx`,
      })
    }

    const { data: { user: authedUser }, error } = await ctx.supabase.auth.getUser()

    if (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `getAuthedUser error: ${error}`,
      })
    }

    if (!authedUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `getAuthedUser error: authedUser not found`,
      })
    }

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
