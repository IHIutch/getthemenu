import { trpc } from '../trpc/client'
import { RouterInputs } from '@/server'


export const useGetSections = (menuId: RouterInputs['section']['getAllByMenuId']['where']['menuId'] = -1) => {
  const { isPending, isError, isSuccess, data, error } = trpc.section.getAllByMenuId.useQuery(
    { where: { menuId } },
    { enabled: menuId !== -1 }
  )
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useGetSection = (id: RouterInputs['section']['getById']['where']['id'] = -1) => {
  const { isPending, isError, isSuccess, data, error } = trpc.section.getById.useQuery(
    { where: { id } },
    { enabled: id !== -1 }
  )
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useCreateSection = (menuId: RouterInputs['section']['getAllByMenuId']['where']['menuId']) => {
  const { section: sectionUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.section.create.useMutation({
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await sectionUtils.getAllByMenuId.cancel({
        where: { menuId }
      })
      const previous = sectionUtils.getAllByMenuId.getData({
        where: { menuId }
      })
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, (old) => {
        return old ?
          [...old,
          {
            ...payload,
            id: -1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
          }
          ] : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      sectionUtils.getAllByMenuId.invalidate({
        where: { menuId }
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

export const useUpdateSection = (menuId: RouterInputs['section']['getAllByMenuId']['where']['menuId']) => {
  const { section: sectionUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.section.update.useMutation({
    // When mutate is called:
    onMutate: async ({ where, payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await sectionUtils.getAllByMenuId.cancel({
        where: { menuId }
      })
      const previous = sectionUtils.getAllByMenuId.getData({
        where: { menuId }
      })
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, (old) => {
        return old ? old.map((o) => {
          if (o.id === where.id) {
            return {
              ...o,
              ...payload,
            }
          }
          return o
        }) : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      sectionUtils.getAllByMenuId.invalidate({
        where: { menuId }
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

export const useReorderSections = (menuId: RouterInputs['section']['getAllByMenuId']['where']['menuId']) => {
  const { section: sectionUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.section.reorder.useMutation({
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await sectionUtils.getAllByMenuId.cancel({
        where: { menuId }
      })
      const previous = sectionUtils.getAllByMenuId.getData({
        where: { menuId }
      })
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, (old) => {
        return old ? old.map((o) => {
          return {
            ...o,
            ...(payload.find((p) => p.id === o.id) || {}),
          }
        }) : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      sectionUtils.getAllByMenuId.invalidate({
        where: { menuId }
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

export const useDeleteSection = (menuId: RouterInputs['section']['getAllByMenuId']['where']['menuId']) => {
  const { section: sectionUtils } = trpc.useUtils()

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.section.delete.useMutation({
    // When mutate is called:
    onMutate: async ({ where }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await sectionUtils.getAllByMenuId.cancel({
        where: { menuId }
      })
      const previous = sectionUtils.getAllByMenuId.getData({
        where: { menuId }
      })
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, (old) => {
        return old ? old.filter((o) => o.id !== where.id) : undefined
      })
      return { previous }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      sectionUtils.getAllByMenuId.setData({
        where: { menuId }
      }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      sectionUtils.getAllByMenuId.invalidate({
        where: { menuId }
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
