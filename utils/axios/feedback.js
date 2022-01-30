import axios from 'redaxios'

export const postFeedback = async (payload) => {
  const { data } = await axios.post(`/api/feedback`, payload).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
