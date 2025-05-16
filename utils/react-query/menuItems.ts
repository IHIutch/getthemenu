import type { RouterInputs } from '@/server'
import { trpc } from '../trpc'

export function useGetMenuItems(menuId: RouterInputs['menuItem']['getAllByMenuId']['where']['menuId'] = -1) {
  const { isPending, isError, isSuccess, data, error } = trpc.menuItem.getAllByMenuId.useQuery(
    { where: { menuId } },
    { enabled: menuId !== -1 },
  )
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export function useGetMenuItem(id: RouterInputs['menuItem']['getById']['where']['id'] = -1) {
  const { isPending, isError, isSuccess, data, error } = trpc.menuItem.getById.useQuery(
    { where: { id } },
    { enabled: id !== -1 },
  )
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export function useCreateMenuItem(menuId: RouterInputs['menuItem']['getAllByMenuId']['where']['menuId']) {
  const { menuItem: menuItemUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menuItem.create.useMutation({
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await menuItemUtils.getAllByMenuId.cancel({
        where: { menuId },
      })
      const previous = menuItemUtils.getAllByMenuId.getData({
        where: { menuId },
      })
      menuItemUtils.getAllByMenuId.setData({
        where: { menuId },
      }, (old) => {
        return old
          ? [...old, {
            ...payload,
            id: -1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          }]
          : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _updated, context) => {
      menuItemUtils.getAllByMenuId.setData({
        where: { menuId },
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (_updated) => {
      menuItemUtils.getAllByMenuId.invalidate({
        where: { menuId },
      })
    },
  })
  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export function useUpdateMenuItem(menuId: RouterInputs['menuItem']['getAllByMenuId']['where']['menuId']) {
  const { menuItem: menuItemUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menuItem.update.useMutation(
    {
      // When mutate is called:
      onMutate: async ({ where, payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await menuItemUtils.getAllByMenuId.cancel({
          where: { menuId },
        })
        const previous = menuItemUtils.getAllByMenuId.getData({
          where: { menuId },
        })
        menuItemUtils.getAllByMenuId.setData({
          where: { menuId },
        }, (old) => {
          return old
            ? old.map((o) => {
              if (o.id === where.id) {
                return {
                  ...o,
                  ...payload,
                }
              }
              return o
            })
            : undefined
        })
        return { previous, updated: payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (_err, _updated, context) => {
        menuItemUtils.getAllByMenuId.setData({
          where: { menuId },
        }, context?.previous)
      },
      // Always refetch after error or success:
      onSettled: (_updated) => {
        menuItemUtils.getAllByMenuId.invalidate({
          where: { menuId },
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

export function useReorderMenuItems(menuId: RouterInputs['menuItem']['getAllByMenuId']['where']['menuId']) {
  const { menuItem: menuItemUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menuItem.reorder.useMutation({

    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await menuItemUtils.getAllByMenuId.cancel({
        where: { menuId },
      })
      const previous = menuItemUtils.getAllByMenuId.getData({
        where: { menuId },
      })
      menuItemUtils.getAllByMenuId.setData({
        where: { menuId },
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
      menuItemUtils.getAllByMenuId.setData({
        where: { menuId },
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (_updated) => {
      menuItemUtils.getAllByMenuId.invalidate({
        where: { menuId },
      })
    },
  })

  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export function useDeleteMenuItem(menuId: RouterInputs['menuItem']['getAllByMenuId']['where']['menuId']) {
  const { menuItem: menuItemUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.menuItem.delete.useMutation({
    // When mutate is called:
    onMutate: async ({ where }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await menuItemUtils.getAllByMenuId.cancel({
        where: { menuId },
      })
      const previous = menuItemUtils.getAllByMenuId.getData({ where: { menuId } })
      menuItemUtils.getAllByMenuId.setData({
        where: { menuId },
      }, (old) => {
        return old ? old.filter(o => o.id !== where.id) : undefined
      })
      return { previous }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _updated, context) => {
      menuItemUtils.getAllByMenuId.setData({
        where: { menuId },
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (_updated) => {
      menuItemUtils.getAllByMenuId.invalidate({
        where: { menuId },
      })
    },
  })

  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}
