import * as z from 'zod/v4'

import prisma from '../../db'
import { authedProcedure, router } from '../server'

export const menuItemRouter = router({
  getByMenuPublicId: authedProcedure.input(
    z.object({
      menuPublicId: z.string(),
    }),
  ).query(async ({ input }) => {
    const { menuPublicId } = input

    return await prisma.menuItems.findMany({
      where: {
        menus: {
          publicId: menuPublicId,
        },
        deletedAt: null,
      },
      include: {
        image: {
          select: {
            id: true,
            url: true,
            width: true,
            height: true,
          },
          where: {
            deletedAt: null,
          },
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
        menuPublicId: z.string(),
        restaurantId: z.string(),
        sectionId: z.number().optional(),
        position: z.number(),
        title: z.string().nullable(),
        description: z.string().nullable(),
        price: z.number().nullable(),
        image: z.object({
          url: z.url(),
          width: z.number().min(1),
          height: z.number().min(1),
          hex: z.string(),
          blurDataUrl: z.string(),
        }).optional(),
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input

    const restaurant = await prisma.restaurants.findUnique({
      where: {
        publicId: payload.restaurantId,
      },
    })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }

    const menu = await prisma.menus.findUnique({
      where: {
        publicId: payload.menuPublicId,
      },
    })
    if (!menu) {
      throw new Error('Menu not found')
    }

    const section = payload.sectionId
      ? await prisma.sections.findUnique({
          where: {
            id: payload.sectionId,
          },
        })
      : await prisma.sections.create({
          data: {
            position: 0,
            menuId: menu.id,
            restaurantId: restaurant.id,
          },
        })

    if (!section) {
      throw new Error('Section not found')
    }

    return await prisma.menuItems.create({
      data: {
        title: payload.title,
        description: payload.description,
        price: payload.price,
        restaurantId: restaurant.id,
        position: payload.position,
        menuId: menu.id,
        sectionId: section.id,
        image: payload.image
          ? {
              create: {
                ...payload.image,
              },
            }
          : undefined,
      },
    })
  }),
  update: authedProcedure.input(
    z.object({
      id: z.number(),
      payload: z.object({
        title: z.string(),
        description: z.string(),
        price: z.number().nullable(),
        newImage: z.object({
          id: z.number().optional(),
          menuItemId: z.number(),
          url: z.url(),
          width: z.number().min(1),
          height: z.number().min(1),
          hex: z.string(),
          blurDataUrl: z.string(),
        }),
      }).partial(),
    }),
  ).mutation(async ({ input }) => {
    const { id, payload } = input

    if (payload.newImage) {
      await prisma.menuItemImages.updateMany({
        where: { menuItemId: id },
        data: {
          deletedAt: new Date(),
        },
      })

      await prisma.menuItemImages.create({
        data: {
          menuItemId: id,
          url: payload.newImage.url,
          width: payload.newImage.width,
          height: payload.newImage.height,
          hex: payload.newImage.hex,
          blurDataUrl: payload.newImage.blurDataUrl,
        },
      })
    }

    return await prisma.menuItems.update({
      where: {
        id,
      },
      data: {
        title: payload.title,
        description: payload.description,
        price: payload.price,
      },
      include: {
        image: {
          select: {
            id: true,
            url: true,
            width: true,
            height: true,
            hex: true,
            blurDataUrl: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }),
})
