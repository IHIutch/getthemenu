import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteMenuItem,
  getMenuItem,
  getMenuItems,
  postMenuItem,
  putMenuItem,
  putMenuItemsReorder,
} from '../axios/menuItems'

export const useGetMenuItems = (params = {}) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['menuItems', params],
    queryFn: async () => await getMenuItems(params),
    enabled: !!params,
  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useGetMenuItem = (id: number) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['menuItems', id],
    queryFn: async () => await getMenuItem(id),
    enabled: !!id,

  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useCreateMenuItem = (params = {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (payload: {}) => await postMenuItem(payload),
    // When mutate is called:
    onMutate: async (updated) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['menuItems', params]
      })
      const previous = queryClient.getQueryData(['menuItems', params])
      queryClient.setQueryData(['menuItems', params], (old) => {
        return [...old, updated]
      })
      return { previous, updated }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['menuItems', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['menuItems', params]
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

export const useUpdateMenuItem = (params: {}) => {
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
      mutationFn: async ({ id, payload }: { id: number, payload: {} }) => {
        await putMenuItem(id, payload)
      },
      // When mutate is called:
      onMutate: async ({ payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: ['menuItems', params]
        })
        const previous = queryClient.getQueryData(['menuItems', params])
        queryClient.setQueryData(['menuItems', params], (old) => {
          return old.map((o) => {
            if (o.id === payload.id) {
              return {
                ...o,
                ...payload,
              }
            }
            return o
          })
        })
        return { previous, updated: payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['menuItems', params], context?.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries({
          queryKey: ['menuItems', params]
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

export const useReorderMenuItems = (params = {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (payload: {}) => {
      await putMenuItemsReorder(payload)
    },
    // When mutate is called:
    onMutate: async (payload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['menuItems', params]
      })
      const previous = queryClient.getQueryData(['menuItems', params])
      queryClient.setQueryData(['menuItems', params], (old) => {
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
      queryClient.setQueryData(['menuItems', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['menuItems', params]
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

export const useDeleteMenuItem = (params = {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (id: number) => await deleteMenuItem(id),
    // When mutate is called:
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['menuItems', params]
      })
      const previous = queryClient.getQueryData(['menuItems', params])
      queryClient.setQueryData(['menuItems', params], (old) => {
        return old.filter((o) => o.id !== id)
      })
      return { previous, updated: id }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['menuItems', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['menuItems', params]
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
