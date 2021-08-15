import qs from 'qs'
import axios from 'redaxios'

export const getMenus = async (params = null) => {
  const { data } = await axios
    .get(`/api/menus?` + qs.stringify(params))
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getMenu = async (id) => {
  try {
    const { data } = await axios.get(`/api/menus/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postMenu = async (payload) => {
  try {
    const { data } = await axios.post(`/api/menus`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putMenu = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/menus/${id}`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteMenu = async (id) => {
  try {
    const { data } = await axios.delete(`/api/menus/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}
