import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MenuPostType, MenuReorderPostType, getMenu, getMenus, putMenu, putMenusReorder } from '../axios/menus'

export const useGetMenus = (params: {}) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['menus', params],
    queryFn: async () => await getMenus(params),
    enabled: !!params
  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useGetMenu = (id: number) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['menus', id],
    queryFn: async () => await getMenu(id),
    enabled: !!id
  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useUpdateMenu = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }: { id: number, payload: MenuPostType }) => {
      await putMenu(id, payload)
    },
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['menus', params]
      })
      const previous = queryClient.getQueryData(['menus', params])
      queryClient.setQueryData(['menus', params], (old) => ({
        ...old,
        ...payload,
      }))
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['menus', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['menus', params]
      })
    },
  }
  )
  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useReorderMenus = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(
    {
      mutationFn: async (payload: MenuReorderPostType[]) => {
        await putMenusReorder(payload)
      },
      // When mutate is called:
      onMutate: async (payload) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: ['menus', params]
        })
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
        queryClient.setQueryData(['menus', params], context?.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries({
          queryKey: ['menus', params]
        })
      },
    }
  )
  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}
