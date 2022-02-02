import axios from 'redaxios'

export const getUsers = async (params = null) => {
  const { data } = await axios
    .get(`/api/users?`, {
      params,
    })
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getUser = async (id) => {
  const { data } = await axios.get(`/api/users/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postUser = async (payload) => {
  const { data } = await axios.post(`/api/users`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putUser = async (id, payload) => {
  const { data } = await axios.put(`/api/users/${id}`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`/api/users/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
