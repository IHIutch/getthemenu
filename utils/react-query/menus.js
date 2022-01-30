import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getMenu, getMenus, putMenu, putMenusReorder } from '../axios/menus'

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

export const useUpdateMenu = (params) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: mutate,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(
    async ({ id, payload }) => {
      await putMenu(id, payload)
    },
    {
      // When mutate is called:
      onMutate: async ({ payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['menus', params])
        const previous = queryClient.getQueryData(['menus', params])
        queryClient.setQueryData(['menus', params], (old) => ({
          ...old,
          ...payload,
        }))
        return { previous, updated: payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['menus', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['menus', params])
      },
    }
  )
  return {
    mutate,
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useReorderMenus = (params) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: mutate,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(
    async (payload) => {
      await putMenusReorder(payload)
    },
    {
      // When mutate is called:
      onMutate: async (payload) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['menus', params])
        const previous = queryClient.getQueryData(['menus', params])
        queryClient.setQueryData(['menus', params], (old) => {
          return old.map((o) => {
            return {
              ...o,
              ...(payload.find((p) => p.id === o.id) || {}),
            }
          })
        })
        return { previous, updated: payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['menus', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['menus', params])
      },
    }
  )
  return {
    mutate,
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}
