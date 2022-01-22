import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  getMenuItem,
  getMenuItems,
  postMenuItem,
  putMenuItem,
  putMenuItemsReorder,
} from '../axios/menuItems'

export const useGetMenuItems = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['menuItems', params],
    async () => await getMenuItems(params),
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

export const useGetMenuItem = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['menuItems', id],
    async () => await getMenuItem(id),
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

export const useCreateMenuItem = (params) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: mutate,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(postMenuItem, {
    // When mutate is called:
    onMutate: async (updated) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['menuItems', params])
      const previous = queryClient.getQueryData(['menuItems', params])
      queryClient.setQueryData(['menuItems', params], (old) => {
        return [...old, updated]
      })
      return { previous, updated }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['menuItems', params], context.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries(['menuItems', params])
    },
  })
  return {
    mutate,
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateMenuItem = (params) => {
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
      await putMenuItem(id, payload)
    },
    {
      // When mutate is called:
      onMutate: async ({ payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['menuItems', params])
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
        return { previous, payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['menuItems', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['menuItems', params])
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

export const useReorderMenuItems = (params) => {
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
      await putMenuItemsReorder(payload)
    },
    {
      // When mutate is called:
      onMutate: async (payload) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['menuItems', params])
        const previous = queryClient.getQueryData(['menuItems', params])
        queryClient.setQueryData(['menuItems', params], (old) => {
          return old.map((o) => {
            return payload.find((p) => p.id === o.id) || o
          })
        })
        return { previous, payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['menuItems', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['menuItems', params])
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
