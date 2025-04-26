import type { Prisma } from '@prisma/client'

import prisma from '@/utils/prisma'

import { getErrorMessage } from '../functions'

export async function prismaGetMenus({ where }: { where: Prisma.menusWhereInput }) {
  try {
    return await prisma.menus.findMany({
      where,
      orderBy: {
        position: 'asc',
      },
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaGetMenu({ where }: { where: Prisma.menusWhereUniqueInput }) {
  try {
    return await prisma.menus.findUnique({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaCreateMenu({ payload }: { payload: Prisma.menusCreateInput }) {
  try {
    return await prisma.menus.create({
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaUpdateMenu({ where, payload }: { where: Prisma.menusWhereUniqueInput, payload: Prisma.menusUpdateInput }) {
  try {
    return await prisma.menus.update({
      where,
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

type MenusUpdatePositionType = Pick<Prisma.Payload<typeof prisma.menus, 'update'>['scalars'], 'id' | 'position'>

export async function prismaUpdateMenus({ payload }: { payload: MenusUpdatePositionType[] }) {
  try {
    return await prisma.$transaction(
      payload.map(p =>
        prisma.menus.update({
          data: {
            position: p.position,
          },
          where: {
            id: p.id,
          },
        }),
      ),
    )
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaDeleteMenu({ where }: { where: Prisma.menusWhereUniqueInput }) {
  try {
    return await prisma.menus.delete({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
