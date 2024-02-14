import axios from 'redaxios'
import { MenuSchema } from '../zod'
import { z } from 'zod'

const MenuPost = MenuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

const MenuGet = MenuSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string(),
})

const MenuReorderPost = MenuSchema.pick({
  id: true,
  position: true
})

export type MenuPostType = z.infer<typeof MenuPost>
export type MenuGetType = z.infer<typeof MenuGet>
export type MenuReorderPostType = z.infer<typeof MenuReorderPost>


export const getMenus = async (params: {}) => {
  const { data }: {
    data: MenuGetType[]
  } = await axios
    .get(`/api/menus?`, {
      params,
    })
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getMenu = async (id: number) => {
  const { data }: {
    data: MenuGetType
  } = await axios.get(`/api/menus/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postMenu = async (payload: MenuPostType) => {
  const { data }: {
    data: MenuGetType
  } = await axios.post(`/api/menus`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putMenu = async (id: number, payload: MenuPostType) => {
  const { data }: {
    data: MenuGetType
  } = await axios.put(`/api/menus/${id}`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putMenusReorder = async (payload: MenuReorderPostType[]) => {
  const { data }: {
    data: MenuGetType
  } = await axios
    .put(`/api/menus/reorder`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const deleteMenu = async (id: number) => {
  const { data }: {
    data: MenuGetType
  } = await axios.delete(`/api/menus/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
