import type { UploadApiResponseType } from '@/pages/api/uploads'
import axios from 'redaxios'

export async function postUpload(formData: FormData) {
  const { data } = await axios.post<UploadApiResponseType>('/api/uploads', formData).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
