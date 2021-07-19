import QueryString from 'qs'
import useSWR, { mutate } from 'swr'

export const useGetMenuItems = ({ params = null, initialData = null }) => {
  const { data, error, mutate } = useSWR(
    `/api/menuItems?${QueryString.stringify(params)}`,
    { initialData }
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// export const usePostMenuItem = (payload, { params = null }) => {
//   mutate(`/api/menuItems?${QueryString.stringify(params)}`, payload)
// }

export const useGetMenuItem = async (id, { initialData = null }) => {
  const { data, error } = useSWR(`/api/menuItems/${id}`, { initialData })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
