import { prismaCreateMenu, prismaDeleteMenu, prismaGetMenu, prismaGetMenus, prismaUpdateMenu, prismaUpdateMenus } from "@/utils/prisma/menus";
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
    const data = await prismaGetMenus({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No menus found restaurantId: '${where.restaurantId}'`,
      })
    }
    return data
  }),
  getById: publicProcedure.input(z.object({
    where: MenuSchema.pick({ id: true })
  })).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetMenu({ where })

    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No menu found with id: '${where.id}'`,
      })
    }

    const result = MenuSchema.safeParse(data)
    if (!result.success) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: result.error.toString(),
      })
    }
    return result.data
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
      payload: {
        ...payload,
        restaurants: {
          connect: {
            id: payload.restaurantId
          }
        }
      }
    })
    return data
  }),
  update: publicProcedure.input(
    z.object({
      where: MenuSchema.pick({ id: true }),
      payload: MenuSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      }).partial()
    })

  ).mutation(async ({ input }) => {
    const { where, payload } = input
    const data = prismaUpdateMenu({
      where,
      payload
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
    const data = await prismaUpdateMenus({ payload })
    return data
  }),
  delete: publicProcedure.input(
    z.object({
      where: MenuSchema.pick({ id: true }),
    })

  ).mutation(async ({ input }) => {
    const { where } = input
    const data = prismaDeleteMenu({
      where,
    })
    return data
  }),
})