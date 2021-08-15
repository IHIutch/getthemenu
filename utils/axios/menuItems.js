import qs from 'qs'
import axios from 'redaxios'

export const getMenuItems = async (params = null) => {
  try {
    const { data } = await axios.get(`/api/menuItems?` + qs.stringify(params))
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const getMenuItem = async (id) => {
  try {
    const { data } = await axios.get(`/api/menuItems/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postMenuItem = async (payload) => {
  try {
    const { data } = await axios.post(`/api/menuItems`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putMenuItem = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/menuItems/${id}`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteMenuItem = async (id) => {
  try {
    const { data } = await axios.delete(`/api/menuItems/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}
