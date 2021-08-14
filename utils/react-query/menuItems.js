import { useQuery } from 'react-query'
import { getMenuItem, getMenuItems } from '../axios/menuItems'

export const useGetMenuItems = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['menuItems', params],
    async () => await getMenuItems(params)
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useGetMenuItem = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['menuItems', id],
    async () => await getMenuItem(id)
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}
