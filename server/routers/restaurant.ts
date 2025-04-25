import { prismaCreateRestaurant, prismaGetRestaurant, prismaUpdateRestaurant } from '@/utils/prisma/restaurants'
import { authedProcedure, router } from '@/utils/trpc'
import { RestaurantSchema } from '@/utils/zod'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const restaurantRouter = router({
  getById: authedProcedure.input(
    z.object({
      where: RestaurantSchema.pick({ id: true }),
    }),
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetRestaurant({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No restaurant found with id: '${where.id}'`,
      })
    }

    return RestaurantSchema.partial({
      coverImage: true,
    }).parse(data)
  }),
  create: authedProcedure.input(
    z.object({
      payload: RestaurantSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaCreateRestaurant({
      payload: {
        ...payload,
        users: {
          connect: {
            id: payload.userId,
          },
        },
      },
    })
    return data
  }),
  update: authedProcedure.input(
    z.object({
      where: RestaurantSchema.pick({ id: true }),
      payload: RestaurantSchema.omit({
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }).partial(),
    }),
  ).mutation(async ({ input }) => {
    const { where, payload } = input
    const data = prismaUpdateRestaurant({
      where,
      payload,
    })
    return data
  }),
})
