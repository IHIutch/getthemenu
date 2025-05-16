import prisma from '@/utils/prisma'
import { prismaGetRestaurant, prismaUpdateRestaurant } from '@/utils/prisma/restaurants'
import { RestaurantSchema } from '@/utils/zod'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { authedProcedure, router } from '../init'

export const restaurantRouter = router({
  getById: authedProcedure.input(
    z.object({
      where: RestaurantSchema.pick({ id: true }),
    }),
  ).query(async ({ input }) => {

    console.log("HELLOOOO")

    const { where } = input
    const data = await prismaGetRestaurant({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No restaurant found with id: '${where.id}'`,
      })
    }

    return data
  }),
  getOne: authedProcedure.input(
    z.object({
      where: RestaurantSchema.pick({ userId: true }),
    }),
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prisma.restaurants.findFirst({
      where,
    })
    return data
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
    const { payload: { userId, ...rest } } = input
    return await prisma.restaurants.create({
      data: {
        ...rest,
        users: {
          connect: {
            id: userId,
          },
        }
      }
    })

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
