import prisma from '../../db'
import * as z from 'zod/v4'

import { authedProcedure, router } from '../server'

export const sectionRouter = router({
  getByMenuPublicId: authedProcedure.input(
    z.object({
      menuPublicId: z.string(),
    }),
  ).query(async ({ input }) => {
    const { menuPublicId } = input

    return await prisma.sections.findMany({
      where: {
        menus: {
          publicId: menuPublicId,
        },
      },
      orderBy: {
        position: 'asc',
      },
    })
  }),
  create: authedProcedure.input(
    z.object({
      payload: z.object({
        restaurantPublicId: z.string(),
        menuPublicId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        position: z.number(),
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input

    return await prisma.sections.create({
      data: {
        title: payload.title,
        description: payload.description,
        position: payload.position,
        restaurant: {
          connect: {
            publicId: payload.restaurantPublicId,
          },
        },
        menus: {
          connect: {
            publicId: payload.menuPublicId,
          },
        },
      },
    })
  }),
  update: authedProcedure.input(
    z.object({
      id: z.number(),
      payload: z.object({
        title: z.string(),
        description: z.string(),
      }).partial(),
    }),
  ).mutation(async ({ input }) => {
    const { id, payload } = input
    return await prisma.sections.update({
      where: {
        id,
      },
      data: {
        title: payload.title,
        description: payload.description,
      },
    })
  }),
})
