import qs from 'qs'
import axios from 'redaxios'

export const getMenus = async (params = null) => {
  const { data } = await axios
    .get(`/api/menus?` + qs.stringify(params))
    .catch((res) => {
      throw new Error(res.data.res.data.error)
    })
  return data
}

export const getMenu = async (id) => {
  const { data } = await axios.get(`/api/menus/${id}`).catch((res) => {
    throw new Error(res.data.res.data.error)
  })
  return data
}

export const postMenu = async (payload) => {
  const { data } = await axios.post(`/api/menus`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putMenu = async (id, payload) => {
  const { data } = await axios.put(`/api/menus/${id}`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putMenusReorder = async (payload) => {
  const { data } = await axios
    .put(`/api/menus/reorder`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const deleteMenu = async (id) => {
  const { data } = await axios.delete(`/api/menus/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
