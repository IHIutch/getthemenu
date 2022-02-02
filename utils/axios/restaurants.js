import axios from 'redaxios'

export const getRestaurants = async (params = null) => {
  const { data } = await axios
    .get(`/api/restaurants?`, {
      params,
    })
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getRestaurant = async (id) => {
  const { data } = await axios.get(`/api/restaurants/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postRestaurant = async (payload) => {
  const { data } = await axios
    .post(`/api/restaurants`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const putRestaurant = async (id, payload) => {
  const { data } = await axios
    .put(`/api/restaurants/${id}`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const deleteRestaurant = async (id) => {
  const { data } = await axios.delete(`/api/restaurants/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
