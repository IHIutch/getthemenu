import axios from 'redaxios'

export const getMenuItems = async (params: {}) => {
  const { data } = await axios
    .get(`/api/menuItems?`, {
      params,
    })
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getMenuItem = async (id: number) => {
  const { data } = await axios.get(`/api/menuItems/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postMenuItem = async (payload: {}) => {
  const { data } = await axios.post(`/api/menuItems`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putMenuItem = async (id: number, payload: {}) => {
  const { data } = await axios
    .put(`/api/menuItems/${id}`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const putMenuItemsReorder = async (payload: {}) => {
  const { data } = await axios
    .put(`/api/menuItems/reorder`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const deleteMenuItem = async (id: number) => {
  const { data } = await axios.delete(`/api/menuItems/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
