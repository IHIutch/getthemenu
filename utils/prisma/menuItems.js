import { Prisma } from '@prisma/client'
import prisma from '.'
import { menuItemSchema } from '../joi/schemas'

export const prismaGetMenuItems = async (where) => {
  try {
    const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.menuItems.findMany({
      where: validWhere,
      orderBy: {
        position: 'asc',
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetMenuItem = async (where) => {
  try {
    const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.menuItems.findUnique({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostMenuItem = async (payload) => {
  try {
    const validPayload = await menuItemSchema.validateAsync(payload)
    return await prisma.menuItems.create({
      data: {
        ...validPayload,
        coverImage: validPayload.coverImage || Prisma.DbNull,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutMenuItem = async (where, payload) => {
  try {
    const validPayload = await menuItemSchema.validateAsync(payload)
    const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.menuItems.update({
      data: {
        ...validPayload,
        coverImage: validPayload.coverImage || Prisma.DbNull,
      },
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutMenuItems = async (payload) => {
  try {
    const validPayload = await Promise.all(
      payload.map(async (p) => await menuItemSchema.validateAsync(p))
    )
    return await prisma.$transaction(
      validPayload.map((vp) =>
        prisma.menuItems.update({
          data: vp,
          where: {
            id: vp.id,
          },
          select: {
            position: true,
          },
        })
      )
    )
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteMenuItem = async (where) => {
  try {
    const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.menuItems.delete({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
