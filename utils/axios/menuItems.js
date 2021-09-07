import qs from 'qs'
import axios from 'redaxios'

export const getMenuItems = async (params = null) => {
  const { data } = await axios
    .get(`/api/menuItems?` + qs.stringify(params))
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getMenuItem = async (id) => {
  const { data } = await axios.get(`/api/menuItems/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postMenuItem = async (payload) => {
  const { data } = await axios.post(`/api/menuItems`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putMenuItem = async (id, payload) => {
  const { data } = await axios
    .put(`/api/menuItems/${id}`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const putMenuItemsReorder = async (payload) => {
  const { data } = await axios
    .put(`/api/menuItems/reorder`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const deleteMenuItem = async (id) => {
  const { data } = await axios.delete(`/api/menuItems/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
