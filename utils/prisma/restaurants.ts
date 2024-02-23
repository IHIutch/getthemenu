import { Prisma } from '@prisma/client'
import prisma from '@/utils/prisma'
import { getErrorMessage } from '../functions'

export const prismaGetRestaurants = async ({ where }: { where: Prisma.restaurantsWhereInput }) => {
  try {
    return await prisma.restaurants.findMany({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaGetRestaurant = async ({ where }: { where: Prisma.restaurantsWhereUniqueInput }) => {
  try {
    return await prisma.restaurants.findUnique({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaCreateRestaurant = async ({ payload }: { payload: Prisma.restaurantsCreateInput }) => {
  try {
    return await prisma.restaurants.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaUpdateRestaurant = async ({ where, payload }: { where: Prisma.restaurantsWhereUniqueInput, payload: Prisma.restaurantsUpdateInput }) => {
  try {
    return await prisma.restaurants.update({
      data: payload,
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaDeleteRestaurant = async ({ where }: { where: Prisma.restaurantsWhereUniqueInput }) => {
  try {
    return await prisma.restaurants.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
