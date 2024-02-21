import prisma from '@/utils/prisma'
import { getErrorMessage } from '../functions'
import { Prisma } from '@prisma/client'

export const prismaGetMenus = async ({ where }: { where: Prisma.menusWhereInput }) => {
  try {
    return await prisma.menus.findMany({
      where,
      orderBy: {
        position: 'asc',
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaGetMenu = async ({ where }: { where: Prisma.menusWhereUniqueInput }) => {
  try {
    return await prisma.menus.findUnique({
      where: where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaCreateMenu = ({ payload }: { payload: Prisma.menusCreateInput }) => {
  try {
    return prisma.menus.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaUpdateMenu = async ({ where, payload }: { where: Prisma.menusWhereUniqueInput, payload: Prisma.menusUpdateInput }) => {
  try {
    return await prisma.menus.update({
      where,
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

type MenusUpdatePositionType = Pick<Prisma.Payload<typeof prisma.menus, 'update'>['scalars'], 'id' | 'position'>

export const prismaUpdateMenus = async ({ payload }: { payload: MenusUpdatePositionType[] }) => {
  try {
    return await prisma.$transaction(
      payload.map((p) =>
        prisma.menus.update({
          data: {
            position: p.position
          },
          where: {
            id: p.id,
          },
        })
      )
    )
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaDeleteMenu = async ({ where }: { where: Prisma.menusWhereUniqueInput }) => {
  try {
    return await prisma.menus.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
