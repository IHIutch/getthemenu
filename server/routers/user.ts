import prisma from '@/utils/prisma'
import { prismaGetUser } from '@/utils/prisma/users'
import { UserSchema } from '@/utils/zod'
import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'

import { authedProcedure, publicProcedure, router } from '../init'

export const userRouter = router({
  setUpNewAccount: authedProcedure.input(
    z.object({
      payload: UserSchema.pick({
        fullName: true,
      }).extend({
        email: z.string().email(),
      }),
    }),
  ).mutation(async ({ input, ctx }) => {
    const { payload } = input

    return await prisma.restaurants.create({
      data: {
        name: payload.fullName,
        users: {
          create: {
            id: ctx.user.id,
            fullName: payload.fullName,
            trialEndsAt: dayjs().add(30, 'day').endOf('day').toISOString(),
          },
        },
      },
    })
  }),
  getAuthedUser: publicProcedure.query(async ({ ctx }) => {
    const authedUser = ctx.user

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
