import { Prisma } from '@prisma/client'
import prisma from '@/utils/prisma'
import { restaurantSchema } from '../joi/schemas'
import { getErrorMessage } from '../functions'

export const prismaGetRestaurants = async (where: Prisma.restaurantsWhereInput) => {
  try {
    return await prisma.restaurants.findMany({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaGetRestaurant = async (where: Prisma.restaurantsWhereUniqueInput) => {
  try {
    return await prisma.restaurants.findUnique({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaPostRestaurant = async (payload: Prisma.restaurantsCreateInput) => {
  try {
    return await prisma.restaurants.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaPutRestaurant = async (where: Prisma.restaurantsWhereUniqueInput, payload: Prisma.restaurantsUpdateInput) => {
  try {

    return await prisma.restaurants.update({
      data: payload,
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaDeleteRestaurant = async (where: Prisma.restaurantsWhereUniqueInput) => {
  try {
    return await prisma.restaurants.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
