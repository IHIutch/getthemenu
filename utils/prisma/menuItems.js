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
      data: validPayload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutMenuItem = async (where, payload) => {
  const validPayload = await menuItemSchema.validateAsync(payload)
  const validWhere = await menuItemSchema.validateAsync(where)
  try {
    return await prisma.user.update({
      data: validPayload,
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
