import axios from 'redaxios'
export const postUpload = async (formData) => {
  //   const fileExt = name.split('.').pop()
  //   const filePath = `public/${uuidv4()}.${fileExt}`
  //   const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET
  //   const url = `${supabase.storage.url}/object/${bucketName}/${filePath}`
  //   const headers = supabase.storage.headers

  const { data } = await axios.post('/api/uploads', formData).catch((res) => {
    throw new Error(res.data.error)
  })
  return data
}
