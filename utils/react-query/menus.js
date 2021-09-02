import { useQuery } from 'react-query'
import { getMenu, getMenus } from '../axios/menus'

export const useGetMenus = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['menus', params],
    async () => await getMenus(params),
    {
      enabled: !!params,
    }
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useGetMenu = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['menus', id],
    async () => await getMenu(id),
    {
      enabled: !!id,
    }
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}
