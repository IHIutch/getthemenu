import axios from 'redaxios'
import { z } from 'zod'

import { RestaurantSchema, UserSchema } from '../zod'

const _UserPost = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

const _UserGet = UserSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string(),
  restaurants: z.array(RestaurantSchema),
})

export type UserPostType = z.infer<typeof _UserPost>
export type UserGetType = z.infer<typeof _UserGet>

export async function getUsers(params: Record<string, any>) {
  const { data }: {
    data: UserGetType
  } = await axios
    .get(`/api/users?`, {
      params,
    })
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export async function getUser(id: string | undefined) {
  const { data }: {
    data: UserGetType
  } = await axios.get(`/api/users/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export async function postUser(payload: UserPostType) {
  const { data }: {
    data: UserGetType
  } = await axios.post(`/api/users`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export async function putUser(id: string, payload: UserPostType) {
  const { data }: {
    data: UserGetType
  } = await axios.put(`/api/users/${id}`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export async function deleteUser(id: string) {
  const { data }: {
    data: UserGetType
  } = await axios.delete(`/api/users/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
