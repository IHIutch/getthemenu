import type { Prisma } from '@/prisma/generated'

import prisma from '@/utils/prisma'

import { getErrorMessage } from '../functions'

export async function prismaGetRestaurants({ where }: { where: Prisma.restaurantsWhereInput }) {
  try {
    return await prisma.restaurants.findMany({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaGetRestaurant({ where }: { where: Prisma.restaurantsWhereUniqueInput }) {
  try {
    return await prisma.restaurants.findUnique({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaCreateRestaurant({ payload }: { payload: Prisma.restaurantsCreateInput }) {
  try {
    return await prisma.restaurants.create({
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaUpdateRestaurant({ where, payload }: { where: Prisma.restaurantsWhereUniqueInput, payload: Prisma.restaurantsUpdateInput }) {
  try {
    return await prisma.restaurants.update({
      data: payload,
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaDeleteRestaurant({ where }: { where: Prisma.restaurantsWhereUniqueInput }) {
  try {
    return await prisma.restaurants.delete({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
