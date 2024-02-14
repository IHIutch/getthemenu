import axios from 'redaxios'
import { z } from 'zod'
import { RestaurantSchema, UserSchema } from '../zod'

const UserPost = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

const UserGet = UserSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string(),
  restaurants: z.array(RestaurantSchema)
})

export type UserPostType = z.infer<typeof UserPost>
export type UserGetType = z.infer<typeof UserGet>

export const getUsers = async (params: {}) => {
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

export const getUser = async (id: string | undefined) => {
  const { data }: {
    data: UserGetType
  } = await axios.get(`/api/users/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postUser = async (payload: UserPostType) => {
  const { data }: {
    data: UserGetType
  } = await axios.post(`/api/users`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putUser = async (id: string, payload: UserPostType) => {
  const { data }: {
    data: UserGetType
  } = await axios.put(`/api/users/${id}`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const deleteUser = async (id: string) => {
  const { data }: {
    data: UserGetType
  } = await axios.delete(`/api/users/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
