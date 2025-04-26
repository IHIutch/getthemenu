import type { Prisma } from '@/prisma/generated'

import prisma from '@/utils/prisma'

import { getErrorMessage } from '../functions'

export async function prismaGetUsers({ where }: { where: Prisma.usersWhereInput }) {
  try {
    return await prisma.users.findMany({
      where,
      include: {
        restaurants: {
          select: {
            id: true,
          },
        },
      },
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaGetUser({ where }: { where: Prisma.usersWhereUniqueInput }) {
  try {
    return await prisma.users.findUnique({
      where,
      include: {
        restaurants: {
          select: {
            id: true,
          },
        },
      },
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaCreateUser({ payload }: { payload: Prisma.usersCreateInput }) {
  try {
    return await prisma.users.create({
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaUpdateUser({ where, payload }: { where: Prisma.usersWhereUniqueInput, payload: Prisma.usersUpdateInput }) {
  try {
    return await prisma.users.update({
      data: payload,
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaDeleteUser({ where }: { where: Prisma.usersWhereUniqueInput }) {
  try {
    return await prisma.users.delete({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
