import { getErrorMessage } from "@/utils/functions";
import { prismaCreateMenuItem, prismaDeleteMenuItem, prismaGetMenuItem, prismaGetMenuItems, prismaUpdateMenuItem, prismaUpdateMenuItems } from "@/utils/prisma/menuItems";
import { publicProcedure, router } from "@/utils/trpc";
import { MenuItemSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const menuItemRouter = router({
  getAllByMenuId: publicProcedure.input(
    z.object({
      where: MenuItemSchema.pick({ menuId: true })
    })
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetMenuItems({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No menuItems found with menuId: '${where.menuId}'`,
      })
    }

    return z.array(MenuItemSchema.partial({
      image: true
    })).parse(data)
  }),
  getById: publicProcedure.input(
    z.object({
      where: MenuItemSchema.pick({ id: true })
    })
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetMenuItem({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No menuItem found with menuId: '${where.id}'`,
      })
    }
    return MenuItemSchema.partial({
      image: true
    }).parse(data)
  }),
  create: publicProcedure.input(
    z.object({
      payload: MenuItemSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      })
    })
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaCreateMenuItem({
      payload: {
        ...payload,
        restaurants: {
          connect: {
            id: payload.restaurantId
          }
        },
        menus: {
          connect: {
            id: payload.menuId
          }
        },
        sections: {
          connect: {
            id: payload.sectionId
          }
        }
      }
    })
    return data
  }),
  update: publicProcedure.input(
    z.object({
      where: MenuItemSchema.pick({ id: true }),
      payload: MenuItemSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      }).partial()
    })
  ).mutation(async ({ input }) => {
    const { where, payload } = input
    const data = prismaUpdateMenuItem({
      where,
      payload
    })
    return data
  }),
  reorder: publicProcedure.input(
    z.object({
      payload: z.array(
        MenuItemSchema.pick({
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
    const data = await prismaUpdateMenuItems({ payload })
    return data
  }),
  delete: publicProcedure.input(
    z.object({
      where: MenuItemSchema.pick({ id: true }),
    })

  ).mutation(async ({ input }) => {
    const { where } = input
    const data = prismaDeleteMenuItem({
      where,
    })
    return data
  }),
})
