import QueryString from 'qs'
import useSWR, { mutate } from 'swr'

export const useGetMenus = ({ params = null, initialData = null }) => {
  const { data, error, mutate } = useSWR(
    `/api/menus?${QueryString.stringify(params)}`,
    { initialData }
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// export const usePostMenu = (payload, { params = null }) => {
//   mutate(`/api/menus?${QueryString.stringify(params)}`, payload)
// }

export const useGetMenu = async (id, { initialData = null }) => {
  const { data, error } = useSWR(`/api/menus/${id}`, { initialData })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
