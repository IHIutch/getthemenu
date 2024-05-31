import { getErrorMessage } from "@/utils/functions";
import { prismaCreateMenu, prismaDeleteMenu, prismaGetMenu, prismaGetMenus, prismaUpdateMenu, prismaUpdateMenus } from "@/utils/prisma/menus";
import { authedProcedure, router } from "@/utils/trpc";
import { MenuSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const menuRouter = router({
  getAllByRestaurantId: authedProcedure.input(
    z.object({
      where: MenuSchema.pick({ restaurantId: true }),
    })
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetMenus({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No menus found with restaurantId: '${where.restaurantId}'`,
      })
    }
    return data
  }),
  getById: authedProcedure.input(z.object({
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
        message: getErrorMessage(result.error),
      })
    }
    return result.data
  }),
  create: authedProcedure.input(
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
  update: authedProcedure.input(
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
  reorder: authedProcedure.input(
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
  delete: authedProcedure.input(
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
