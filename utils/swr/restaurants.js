import QueryString from 'qs'
import useSWR, { mutate } from 'swr'

export const useGetRestaurants = ({ params = null, initialData = null }) => {
  const { data, error, mutate } = useSWR(
    `/api/restaurant?${QueryString.stringify(params)}`,
    { initialData }
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// export const usePostRestaurant = (payload, { params = null }) => {
//   mutate(`/api/restaurant?${QueryString.stringify(params)}`, payload)
// }

export const useGetRestaurant = async (id, { initialData = null }) => {
  const { data, error } = useSWR(`/api/restaurant/${id}`, { initialData })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
