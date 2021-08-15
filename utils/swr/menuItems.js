import qs from 'qs'
import useSWR, { mutate } from 'swr'
import axios from 'redaxios'

export const useGetMenuItems = ({ params = {}, initialData = null }) => {
  const { data, error } = useSWR(`/api/menuItems?${qs.stringify(params)}`, {
    initialData,
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
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

export const handlePostMenuItem = async ({ payload, params = {} }) => {
  return await mutate(
    `/api/menuItems?${qs.stringify(params)}`,
    async (menuItems) => {
      const { data } = await axios.post(`/api/menuItems/`, payload)
      return menuItems.push(data)
    }
  )
}

export const handlePutMenuItem = async ({ payload, params = {} }) => {
  return await mutate(
    `/api/menuItems?${qs.stringify(params)}`,
    async (menuItems) => {
      const { data } = await axios.put(`/api/menuItems/${payload.id}`, payload)

      return menuItems.map((menuItem) => {
        if (menuItem.id === payload.id) return data
        return menuItem
      })
    }
  )
}
