import { UploadApiResponseType } from '@/pages/api/uploads'
import axios from 'redaxios'

export const postUpload = async (formData: FormData) => {
  const { data } = await axios.post<UploadApiResponseType>('/api/uploads', formData).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
