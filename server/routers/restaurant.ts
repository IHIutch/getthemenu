import { getErrorMessage } from "@/utils/functions";
import { prismaGetRestaurant, prismaUpdateRestaurant } from "@/utils/prisma/restaurants";
import { publicProcedure, router } from "@/utils/trpc";
import { RestaurantSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const restaurantRouter = router({
  getById: publicProcedure.input(
    z.object({
      where: RestaurantSchema.pick({ id: true })
    })
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetRestaurant({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No restaurant found with id: '${where.id}'`,
      })
    }

    const result = RestaurantSchema.safeParse(data)
    if (!result.success) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: getErrorMessage(result.error),
      })
    }
    return result.data
  }),
  update: publicProcedure.input(
    z.object({
      where: RestaurantSchema.pick({ id: true }),
      payload: RestaurantSchema.omit({
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      }).partial()
    })
  ).mutation(async ({ input }) => {
    const { where, payload } = input
    const data = prismaUpdateRestaurant({
      where,
      payload
    })
    return data
  })
})
