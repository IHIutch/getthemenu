import QueryString from 'qs'
import axios from 'redaxios'

export const getUsers = async (params = null) => {
  try {
    const { data } = await axios.get(
      `/api/users?` + QueryString.stringify(params)
    )
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const getUser = async (id) => {
  try {
    const { data } = await axios.get(`/api/users/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postUser = async (payload) => {
  try {
    const { data } = await axios.post(`/api/users`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putUser = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/users/${id}`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteUser = async (id) => {
  try {
    const { data } = await axios.delete(`/api/users/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}
