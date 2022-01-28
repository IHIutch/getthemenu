import prisma from '.'
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
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostRestaurant = async (payload) => {
  try {
    const validPayload = await restaurantSchema.validateAsync(payload)
    return await prisma.restaurants.create({
      data: validPayload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutRestaurant = async (where, payload) => {
  const validPayload = await restaurantSchema.validateAsync(payload)
  const validWhere = await restaurantSchema.validateAsync(where)
  try {
    return await prisma.user.update({
      data: validPayload,
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
