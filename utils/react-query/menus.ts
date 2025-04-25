import type { RouterInputs } from '@/server'
import { trpc } from '../trpc/client'

export function useGetMenus(restaurantId: RouterInputs['menu']['getAllByRestaurantId']['where']['restaurantId'] = '') {
  const { isPending, isError, isSuccess, data, error } = trpc.menu.getAllByRestaurantId.useQuery(
    { where: { restaurantId } },
    { enabled: restaurantId !== '' },
  )
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export function useGetMenu(id: RouterInputs['menu']['getById']['where']['id'] = -1) {
  const { isLoading, isError, isSuccess, data, error } = trpc.menu.getById.useQuery(
    { where: { id } },
    { enabled: id !== -1 },
  )

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export function useUpdateMenu(id: RouterInputs['menu']['getById']['where']['id']) {
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
        where: { id },
      })
      const previous = menuUtils.getById.getData({
        where: { id },
      })
      menuUtils.getById.setData({
        where: { id },
      }, (old) => {
        return old
          ? {
              ...old,
              ...payload,
              updatedAt: new Date(),
            }
          : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _updated, context) => {
      menuUtils.getById.setData({ where: { id } }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (_updated) => {
      menuUtils.getById.invalidate({
        where: { id },
      })
    },
  },
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

export function useReorderMenus(restaurantId: RouterInputs['menu']['getAllByRestaurantId']['where']['restaurantId']) {
  const { menu: menuUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menu.reorder.useMutation(
    {
      // When mutate is called:
      onMutate: async ({ payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await menuUtils.getAllByRestaurantId.cancel({
          where: { restaurantId },
        })
        const previous = menuUtils.getAllByRestaurantId.getData({
          where: { restaurantId },
        })
        menuUtils.getAllByRestaurantId.setData({
          where: { restaurantId },
        }, (old) => {
          return old
            ? old.map((o) => {
                return {
                  ...o,
                  ...(payload.find(p => p.id === o.id)),
                }
              }).sort((a, b) => (a.position || 0) - (b.position || 0))
            : undefined
        })
        return { previous, updated: payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (_err, _updated, context) => {
        menuUtils.getAllByRestaurantId.setData({
          where: { restaurantId },
        }, context?.previous)
      },
      // Always refetch after error or success:
      onSettled: (_updated) => {
        menuUtils.getAllByRestaurantId.invalidate({
          where: { restaurantId },
        })
      },
    },
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

export function useDeleteMenu() {
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
