import axios from 'redaxios'

export const getSections = async (params: {}) => {
  const { data } = await axios
    .get(`/api/sections?`, {
      params,
    })
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getSection = async (id: number) => {
  const { data } = await axios.get(`/api/sections/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const postSection = async (payload: {}) => {
  const { data } = await axios.post(`/api/sections`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}

export const putSection = async (id: number, payload: {}) => {
  const { data } = await axios
    .put(`/api/sections/${id}`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const putSectionsReorder = async (payload: {}) => {
  const { data } = await axios
    .put(`/api/sections/reorder`, payload)
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const deleteSection = async (id: number) => {
  const { data } = await axios.delete(`/api/sections/${id}`).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
