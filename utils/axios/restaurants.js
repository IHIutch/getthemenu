import qs from 'qs'
import axios from 'redaxios'

export const getRestaurants = async (params = null) => {
  try {
    const { data } = await axios.get(`/api/restaurants?` + qs.stringify(params))
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const getRestaurant = async (id) => {
  try {
    const { data } = await axios.get(`/api/restaurants/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postRestaurant = async (payload) => {
  try {
    const { data } = await axios.post(`/api/restaurants`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putRestaurant = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/restaurants/${id}`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteRestaurant = async (id) => {
  try {
    const { data } = await axios.delete(`/api/restaurants/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}
