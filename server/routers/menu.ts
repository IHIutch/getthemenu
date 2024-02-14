import { prismaCreateMenu, prismaGetMenus, prismaUpdateMenus } from "@/utils/prisma/menus";
import { publicProcedure, router } from "@/utils/trpc";
import { MenuSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const menuRouter = router({
  getAllByRestaurantId: publicProcedure.input(
    z.object({
      where: MenuSchema.pick({ restaurantId: true }),
    })
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetMenus(where)
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No menus found restaurantId: '${where.restaurantId}'`,
      })
    }
    return data
  }),
  create: publicProcedure.input(
    z.object({
      payload: MenuSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      })
    })
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaCreateMenu({
      ...payload,
      restaurants: {
        connect: {
          id: payload.restaurantId
        }
      }
    })
    return data
  }),
  reorder: publicProcedure.input(
    z.object({
      payload: z.array(
        MenuSchema.pick({
          id: true,
          position: true
        }).extend({
          id: z.number().positive(),
          position: z.number()
        })
      )
    })
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaUpdateMenus(payload)
    return data
  })
})