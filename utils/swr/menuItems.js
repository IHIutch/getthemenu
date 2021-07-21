import QueryString from 'qs'
import useSWR, { mutate } from 'swr'
import axios from 'redaxios'

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

export const usePostMenuItem = (payload, { params = null }) => {
  mutate(`/api/menuItems?${QueryString.stringify(params)}`, payload)
}

export const handlePutMenuItem = async (id, payload, { params = null }) => {
  try {
    await mutate(
      `/api/menuItems?${QueryString.stringify(params)}`,
      async (menuItems) => {
        const { data: updatedMenuItem } = await axios.put(
          `/api/menuItems/${id}`,
          payload
        )
        const filteredMenuItems = menuItems.filter(
          (menuItem) => menuItem.id !== id
        )

        return [...filteredMenuItems, updatedMenuItem]
      }
    )
  } catch (error) {
    console.log(error)
  }
}

export const useGetMenuItem = async (id, { initialData = null }) => {
  const { data, error } = useSWR(`/api/menuItems/${id}`, { initialData })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
