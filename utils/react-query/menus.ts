import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MenuPostType, MenuReorderPostType, getMenu, getMenus, putMenu, putMenusReorder } from '../axios/menus'
import { trpc } from '../trpc/client'
import { RouterInputs } from '@/server'

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

export const useGetMenu = (id: number = -1) => {
  const { isLoading, isError, isSuccess, data, error } = trpc.menu.getById.useQuery(
    { where: { id } },
    { enabled: id !== -1 }
  )

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateMenu = (id: RouterInputs['menu']['getById']['where']['id']) => {
  const { menu: menuUtils } = trpc.useUtils()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menu.update.useMutation({
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await menuUtils.getById.cancel({
        where: { id }
      })
      const previous = menuUtils.getById.getData({
        where: { id }
      })
      menuUtils.getById.setData({
        where: { id }
      }, (old) => {
        return old ? {
          ...old,
          ...payload,
          updatedAt: new Date()
        } : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      menuUtils.getById.setData({ where: { id } }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      menuUtils.getById.invalidate({
        where: { id }
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

export const useDeleteMenu = () => {
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menu.delete.useMutation()

  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}
