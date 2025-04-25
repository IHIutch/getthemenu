import { prismaCreateSection, prismaDeleteSection, prismaGetSection, prismaGetSections, prismaUpdateSection, prismaUpdateSections } from '@/utils/prisma/sections'
import { authedProcedure, router } from '@/utils/trpc'
import { SectionSchema } from '@/utils/zod'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const sectionRouter = router({
  getAllByMenuId: authedProcedure.input(
    z.object({
      where: SectionSchema.pick({ menuId: true }),
    }),
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetSections({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No sections found with menuId: '${where.menuId}'`,
      })
    }
    return data
  }),
  getById: authedProcedure.input(
    z.object({
      where: SectionSchema.pick({ id: true }),
    }),
  ).query(async ({ input }) => {
    const { where } = input
    const data = await prismaGetSection({ where })
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No section found with menuId: '${where.id}'`,
      })
    }
    return data
  }),
  create: authedProcedure.input(
    z.object({
      payload: SectionSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaCreateSection({
      payload: {
        ...payload,
        restaurants: {
          connect: {
            id: payload.restaurantId,
          },
        },
        menus: {
          connect: {
            id: payload.menuId,
          },
        },
      },
    })
    return data
  }),
  update: authedProcedure.input(
    z.object({
      where: SectionSchema.pick({ id: true }),
      payload: SectionSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }).partial(),
    }),

  ).mutation(async ({ input }) => {
    const { where, payload } = input
    const data = prismaUpdateSection({
      where,
      payload,
    })
    return data
  }),
  reorder: authedProcedure.input(
    z.object({
      payload: z.array(
        SectionSchema.pick({
          id: true,
          position: true,
        }).extend({
          id: z.number().positive(),
          position: z.number(),
        }),
      ),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaUpdateSections({ payload })
    return data
  }),
  delete: authedProcedure.input(
    z.object({
      where: SectionSchema.pick({ id: true }),
    }),

  ).mutation(async ({ input }) => {
    const { where } = input
    const data = prismaDeleteSection({
      where,
    })
    return data
  }),
})
