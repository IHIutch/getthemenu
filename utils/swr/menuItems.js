import QueryString from 'qs'
import useSWR, { mutate } from 'swr'

export const useGetMenuItems = ({ params = null, initialData = null }) => {
  const { data, error, mutate } = useSWR(
    `/api/menuItem?${QueryString.stringify(params)}`,
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
//   mutate(`/api/menuItem?${QueryString.stringify(params)}`, payload)
// }

export const useGetMenuItem = async (id, { initialData = null }) => {
  const { data, error } = useSWR(`/api/menuItem/${id}`, { initialData })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
