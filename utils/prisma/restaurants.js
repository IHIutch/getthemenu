import { Prisma } from '@prisma/client'
import prisma from '@/utils/prisma'
import { restaurantSchema } from '../joi/schemas'

export const prismaGetRestaurants = async (where) => {
  try {
    const validWhere = await restaurantSchema.validateAsync(where)
    return await prisma.restaurants.findMany({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetRestaurant = async (where) => {
  try {
    const validWhere = await restaurantSchema.validateAsync(where)
    return await prisma.restaurants.findUnique({
      where: validWhere,
      include: {
        menus: {
          where: {
            deletedAt: null,
          },
        },
        sections: {
          where: {
            deletedAt: null,
          },
        },
        menuItems: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostRestaurant = async (payload) => {
  try {
    const validPayload = await restaurantSchema.validateAsync(payload)
    if (validPayload?.coverImage === null) {
      validPayload.coverImage = Prisma.DbNull
    }

    return await prisma.restaurants.create({
      data: {
        ...validPayload,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutRestaurant = async (where, payload) => {
  try {
    const validPayload = await restaurantSchema.validateAsync(payload)
    const validWhere = await restaurantSchema.validateAsync(where)

    if (validPayload?.coverImage === null) {
      validPayload.coverImage = Prisma.DbNull
    }

    return await prisma.restaurants.update({
      data: {
        ...validPayload,
      },
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteRestaurant = async (where) => {
  try {
    const validWhere = await restaurantSchema.validateAsync(where)
    return await prisma.restaurants.delete({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
