import qs from 'qs'
import axios from 'redaxios'

export const getSections = async (params = null) => {
  try {
    const { data } = await axios.get(`/api/sections?` + qs.stringify(params))
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const getSection = async (id) => {
  try {
    const { data } = await axios.get(`/api/sections/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postSection = async (payload) => {
  try {
    const { data } = await axios.post(`/api/sections`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putSection = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/sections/${id}`, payload)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteSection = async (id) => {
  try {
    const { data } = await axios.delete(`/api/sections/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}
